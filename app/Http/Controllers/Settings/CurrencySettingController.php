<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CurrencySettingController extends Controller
{
    /**
     * Update the currency settings.
     */
    public function update(Request $request)
    {
        try {
            $validated = $request->validate([
                'decimalFormat' => 'required|string|in:0,1,2,3,4',
                'defaultCurrency' => 'required|string|exists:currencies,code',
                'thousandsSeparator' => 'required|string',
                'floatNumber' => 'required|boolean',
                'currencySymbolSpace' => 'required|boolean',
                'currencySymbolPosition' => 'required|string|in:before,after',
            ]);
            
            // Custom validation for decimal separator
            $decimalSeparator = $request->input('decimalSeparator');
            if (!in_array($decimalSeparator, ['.', ','])) {
                throw new \Exception('The selected decimal separator is invalid.');
            }
            $validated['decimalSeparator'] = $decimalSeparator;
            
            $user = auth()->user();
            $storeId = null;
            
            // For company users, save settings per store
            if ($user->type === 'company' && getCurrentStoreId($user)) {
                $storeId = getCurrentStoreId($user);
            }
            
            // Update settings using helper function with store support
            foreach ($validated as $key => $value) { 
                updateSetting($key, $value, null, $storeId);
            }
            
            return redirect()->back()->with('success', __('Currency settings updated successfully.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('error', __('Failed to update currency settings: :error', ['error' => $e->getMessage()]));
        }
    }
}