<?php

namespace App\Http\Controllers\Store;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\CustomerAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ProfileController extends Controller
{
    public function updateProfile(Request $request, $storeSlug)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other,prefer_not_to_say',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
        ]);

        $customer = Auth::guard('customer')->user();
        
        // Check if email is already taken by another customer in the same store
        $existingCustomer = Customer::where('store_id', $customer->store_id)
            ->where('email', $request->email)
            ->where('id', '!=', $customer->id)
            ->first();

        if ($existingCustomer) {
            throw ValidationException::withMessages([
                'email' => ['This email is already taken.'],
            ]);
        }

        // Update customer profile
        $customer->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'date_of_birth' => $request->date_of_birth,
            'gender' => $request->gender,
        ]);

        // Update or create address if provided
        if ($request->address) {
            CustomerAddress::updateOrCreate(
                [
                    'customer_id' => $customer->id,
                    'type' => 'billing',
                    'is_default' => true
                ],
                [
                    'address' => $request->address,
                    'city' => $request->city ?? '',
                    'state' => $request->state ?? '',
                    'postal_code' => $request->postal_code ?? '',
                    'country' => $request->country ?? 'United States',
                ]
            );
        }

        return back()->with('success', 'Profile updated successfully!');
    }

    public function updatePassword(Request $request, $storeSlug)
    {
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $customer = Auth::guard('customer')->user();

        if (!Hash::check($request->current_password, $customer->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The current password is incorrect.'],
            ]);
        }

        $customer->update([
            'password' => $request->password,
        ]);

        return back()->with('success', 'Password updated successfully!');
    }
}