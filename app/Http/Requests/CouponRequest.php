<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CouponRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $couponId = $this->route('coupon') ? $this->route('coupon')->id : null;

        return [
            'name' => 'required|string|max:255',
            'type' => 'required|in:percentage,flat',
            'minimum_spend' => 'nullable|numeric|min:0',
            'maximum_spend' => 'nullable|numeric|min:0|gte:minimum_spend',
            'discount_amount' => [
                'required',
                'numeric',
                'min:0',
                function ($attribute, $value, $fail) {
                    if ($this->type === 'percentage' && $value > 99) {
                        $fail('The discount amount cannot exceed 99% for percentage discounts.');
                    }
                }
            ],
            'use_limit_per_coupon' => 'nullable|integer|min:1',
            'use_limit_per_user' => 'nullable|integer|min:1',
            'expiry_date' => 'nullable|date|after:today',
            'code' => [
                'required_if:code_type,manual',
                'string',
                'max:50',
                Rule::unique('coupons', 'code')->ignore($couponId)
            ],
            'code_type' => 'required|in:manual,auto',
            'status' => 'boolean'
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The coupon name is required.',
            'type.required' => 'The discount type is required.',
            'type.in' => 'The discount type must be either percentage or flat amount.',
            'discount_amount.required' => 'The discount amount is required.',
            'discount_amount.min' => 'The discount amount must be greater than 0.',
            'maximum_spend.gte' => 'The maximum spend must be greater than or equal to minimum spend.',
            'expiry_date.after' => 'The expiry date must be a future date.',
            'code.required_if' => 'The coupon code is required when manual entry is selected.',
            'code.unique' => 'This coupon code is already taken.',
            'code_type.required' => 'Please select a code generation method.',
        ];
    }
}
