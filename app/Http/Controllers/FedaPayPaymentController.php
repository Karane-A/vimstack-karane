<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;
use FedaPay\FedaPay;
use FedaPay\Transaction;

class FedaPayPaymentController extends Controller
{
    public function processPayment(Request $request)
    {
        $validated = validatePaymentRequest($request, [
            'transaction_id' => 'required|string',
        ]);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['fedapay_secret_key'])) {
                return back()->withErrors(['error' => 'FedaPay not configured']);
            }

            $this->configureFedaPay($settings['payment_settings']);
            
            $transaction = Transaction::retrieve($validated['transaction_id']);
            
            if ($transaction->status === 'approved') {
                processPaymentSuccess([
                    'user_id' => auth()->id(),
                    'plan_id' => $plan->id,
                    'billing_cycle' => $validated['billing_cycle'],
                    'payment_method' => 'fedapay',
                    'coupon_code' => $validated['coupon_code'] ?? null,
                    'payment_id' => $validated['transaction_id'],
                ]);

                return back()->with('success', __('Payment successful and plan activated'));
            }

            return back()->withErrors(['error' => __('Payment failed or cancelled')]);

        } catch (\Exception $e) {
            return back()->withErrors(['error' => __('Payment processing failed')]);
        }
    }

    public function createPayment(Request $request)
    {
        $validated = validatePaymentRequest($request);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['fedapay_secret_key'])) {
                return response()->json(['error' => __('FedaPay not configured')], 400);
            }

            $this->configureFedaPay($settings['payment_settings']);

            $user = auth()->user();
            
            $transaction = Transaction::create([
                'description' => 'Plan: ' . $plan->name,
                'amount' => $pricing['final_price'] * 100, // Amount in cents
                'currency' => ['iso' => 'XOF'],
                'callback_url' => route('fedapay.callback'),
                'customer' => [
                    'firstname' => $user->name ?? 'Customer',
                    'email' => $user->email,
                ],
                'custom_metadata' => [
                    'plan_id' => $plan->id,
                    'user_id' => $user->id,
                    'billing_cycle' => $validated['billing_cycle'],
                    'coupon_code' => $validated['coupon_code'] ?? null,
                ]
            ]);

            $token = $transaction->generateToken();

            return response()->json([
                'success' => true,
                'payment_url' => $token->url,
                'transaction_id' => $transaction->id,
                'token' => $token->token
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => __('Payment creation failed')], 500);
        }
    }

    public function callback(Request $request)
    {
        try {
            $settings = getPaymentGatewaySettings();
            $this->configureFedaPay($settings['payment_settings']);
            
            $transactionId = $request->input('id');
            $transaction = Transaction::retrieve($transactionId);
            
            if ($transaction->status === 'approved') {
                $metadata = $transaction->custom_metadata;
                
                processPaymentSuccess([
                    'user_id' => $metadata['user_id'],
                    'plan_id' => $metadata['plan_id'],
                    'billing_cycle' => $metadata['billing_cycle'],
                    'payment_method' => 'fedapay',
                    'coupon_code' => $metadata['coupon_code'] ?? null,
                    'payment_id' => $transactionId,
                ]);
                
                return redirect()->route('plans.index')->with('success', __('Payment successful and plan activated'));
            }

            return redirect()->route('plans.index')->with('error', __('Payment was not completed'));

        } catch (\Exception $e) {
            return response()->json(['error' => __('Callback processing failed')], 500);
        }
    }

    private function configureFedaPay($settings)
    {
        FedaPay::setApiKey($settings['fedapay_secret_key']);
        FedaPay::setEnvironment($settings['fedapay_mode'] === 'live' ? 'live' : 'sandbox');
    }
}