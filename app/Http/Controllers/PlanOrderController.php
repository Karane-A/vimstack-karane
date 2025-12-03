<?php

namespace App\Http\Controllers;

use App\Models\PlanOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PlanOrderController extends BaseController
{
    public function index(Request $request)
    {
        $user = Auth::user();
        
        // Permission check is handled by middleware
        
        $query = PlanOrder::with(['user', 'plan', 'coupon', 'processedBy']);
        
        // Filter by current user if not superadmin
        if ($user->type !== 'superadmin') {
            if ($user->type === 'company') {
                $query->where('user_id', Auth::id());
            } else {
                // For regular users, show their company's orders
                $companyId = $user->created_by ?: Auth::id();
                $query->where('user_id', $companyId);
            }
        }

        // Apply search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('plan', function ($planQuery) use ($search) {
                      $planQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Apply filters
        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'ordered_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 10);
        $planOrders = $query->paginate($perPage);

        return Inertia::render('plans/plan-orders', [
            'planOrders' => $planOrders,
            'filters' => $request->only(['search', 'status', 'sort_by', 'sort_order', 'per_page'])
        ]);
    }

    public function approve(PlanOrder $planOrder)
    {
        try {
            $planOrder->approve(Auth::id());
            
            return redirect()->route('plan-orders.index')
                ->with('success', __('Plan order approved successfully!'));
        } catch (\Exception $e) {
            return redirect()->route('plan-orders.index')
                ->with('error', __('Failed to approve plan order: ') . $e->getMessage());
        }
    }

    public function reject(Request $request, PlanOrder $planOrder)
    {
        try {
            $request->validate([
                'notes' => 'nullable|string|max:500'
            ]);

            $planOrder->reject(Auth::id(), $request->notes);
            
            return redirect()->route('plan-orders.index')
                ->with('success', __('Plan order rejected successfully!'));
        } catch (\Exception $e) {
            return redirect()->route('plan-orders.index')
                ->with('error', __('Failed to reject plan order: ') . $e->getMessage());
        }
    }
}
