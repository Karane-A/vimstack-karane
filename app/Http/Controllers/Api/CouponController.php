<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StoreCoupon;
use App\Services\CartCalculationService;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function validate(Request $request)
    {
        $request->validate([
            'store_id' => 'required|exists:stores,id',
            'coupon_code' => 'required|string',
            'shipping_method_id' => 'nullable|exists:shippings,id',
        ]);

        $coupon = StoreCoupon::where('store_id', $request->store_id)
            ->where('code', $request->coupon_code)
            ->where('status', true)
            ->where('start_date', '<=', now())
            ->where('expiry_date', '>=', now())
            ->first();

        if (!$coupon) {
            return response()->json([
                'valid' => false,
                'message' => 'Invalid or expired coupon code'
            ]);
        }

        // Check usage limits
        if ($coupon->use_limit_per_coupon && $coupon->used_count >= $coupon->use_limit_per_coupon) {
            return response()->json([
                'valid' => false,
                'message' => 'Coupon usage limit exceeded'
            ]);
        }

        // Get cart calculation with coupon
        $calculation = CartCalculationService::calculateCartTotals(
            $request->store_id,
            session()->getId(),
            $request->coupon_code,
            $request->shipping_method_id ?? null
        );

        if ($calculation['discount'] == 0) {
            return response()->json([
                'valid' => false,
                'message' => 'Minimum order amount not met for this coupon'
            ]);
        }

        return response()->json([
            'valid' => true,
            'message' => 'Coupon applied successfully!',
            'coupon' => [
                'code' => $coupon->code,
                'name' => $coupon->name,
                'type' => $coupon->type,
                'discount_amount' => $coupon->discount_amount,
                'minimum_spend' => $coupon->minimum_spend,
            ],
            'discount' => $calculation['discount'],
            'new_total' => $calculation['total']
        ]);
    }
}