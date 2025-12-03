<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Http\Requests\CouponRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CouponController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Coupon::with('creator');

        // Apply search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        // Apply filters
        if ($request->has('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $perPage = $request->get('per_page', 10);
        $coupons = $query->latest()->paginate($perPage);

        return Inertia::render('coupons/index', [
            'coupons' => $coupons,
            'filters' => $request->only(['search', 'type', 'status', 'per_page'])
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CouponRequest $request)
    {

        $data = $request->all();
        $data['created_by'] = Auth::id();

        // Generate code if auto-generate is selected
        if ($request->code_type === 'auto') {
            do {
                $data['code'] = strtoupper(Str::random(8));
            } while (Coupon::where('code', $data['code'])->exists());
        }

        $coupon = Coupon::create($data);

        return redirect()->route('coupons.index')->with('success', __('Coupon created successfully!'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CouponRequest $request, Coupon $coupon)
    {

        $data = $request->all();

        // Generate new code if switching to auto-generate
        if ($request->code_type === 'auto' && $coupon->code_type !== 'auto') {
            do {
                $data['code'] = strtoupper(Str::random(8));
            } while (Coupon::where('code', $data['code'])->where('id', '!=', $coupon->id)->exists());
        }

        $coupon->update($data);

        return redirect()->route('coupons.index')->with('success', __('Coupon updated successfully!'));
    }

    /**
     * Validate coupon code
     */
    public function validate(Request $request)
    {
        $request->validate([
            'coupon_code' => 'required|string',
            'plan_id' => 'required|integer',
            'amount' => 'required|numeric|min:0'
        ]);
        
        $coupon = Coupon::where('code', $request->coupon_code)
            ->where('status', 1)
            ->first();
            
        if (!$coupon) {
            return response()->json([
                'valid' => false,
                'message' => __('Invalid or inactive coupon code')
            ], 400);
        }
        
        // Check if coupon is expired
        if ($coupon->expiry_date && $coupon->expiry_date < now()) {
            return response()->json([
                'valid' => false,
                'message' => __('Coupon has expired')
            ], 400);
        }
        
        // Check usage limit
        if ($coupon->use_limit_per_coupon && $coupon->used_count >= $coupon->use_limit_per_coupon) {
            return response()->json([
                'valid' => false,
                'message' => __('Coupon usage limit exceeded')
            ], 400);
        }
        
        // Check minimum amount
        if ($coupon->minimum_spend && $request->amount < $coupon->minimum_spend) {
            return response()->json([
                'valid' => false,
                'message' => __('Minimum spend requirement not met')
            ], 400);
        }
        
        return response()->json([
            'valid' => true,
            'coupon' => [
                'id' => $coupon->id,
                'code' => $coupon->code,
                'type' => $coupon->type,
                'value' => $coupon->discount_amount
            ]
        ]);
    }

    /**
     * Toggle the status of the specified coupon.
     */
    public function toggleStatus(Coupon $coupon)
    {
        $coupon->update([
            'status' => !$coupon->status
        ]);

        return back()->with('success', __('Coupon status updated successfully!'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Coupon $coupon)
    {
        $coupon->delete();

        return redirect()->route('coupons.index')->with('success', __('Coupon deleted successfully!'));
    }
}
