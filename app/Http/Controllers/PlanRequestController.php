<?php

namespace App\Http\Controllers;

use App\Models\PlanRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PlanRequestController extends BaseController
{
    public function index(Request $request)
    {
        $user = Auth::user();
        
        // Permission check is handled by middleware
        
        $query = PlanRequest::with(['user', 'plan', 'approver', 'rejector']);
        
        // Filter by current user if not superadmin
        if ($user->type !== 'superadmin') {
            if ($user->type === 'company') {
                $query->where('user_id', Auth::id());
            } else {
                // For regular users, show their company's requests
                $companyId = $user->created_by ?: Auth::id();
                $query->where('user_id', $companyId);
            }
        }

        // Apply search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($userQuery) use ($search) {
                    $userQuery->where('name', 'like', "%{$search}%")
                             ->orWhere('email', 'like', "%{$search}%");
                })
                ->orWhereHas('plan', function ($planQuery) use ($search) {
                    $planQuery->where('name', 'like', "%{$search}%");
                });
            });
        }

        // Apply filters
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $perPage = $request->get('per_page', 10);
        $planRequests = $query->latest()->paginate($perPage);

        return Inertia::render('plans/plan-request', [
            'planRequests' => $planRequests,
            'filters' => $request->only(['search', 'status', 'per_page'])
        ]);
    }

    public function approve(PlanRequest $planRequest)
    {
        $planRequest->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => Auth::id(),
        ]);
        
        // Assign plan to the user
        $user = $planRequest->user;
        $plan = $planRequest->plan;
        
        $expireDate = $planRequest->duration === 'yearly' 
            ? now()->addYear() 
            : now()->addMonth();
            
        $user->update([
            'plan_id' => $plan->id,
            'plan_is_active' => 1,
            'plan_expire_date' => $expireDate,
            'is_trial' => 0,
            'trial_expire_date' => null
        ]);

        return redirect()->route('plan-requests.index')->with('success', __('Plan request approved and assigned successfully!'));
    }

    public function reject(PlanRequest $planRequest)
    {
        $planRequest->update([
            'status' => 'rejected',
            'rejected_at' => now(),
            'rejected_by' => Auth::id(),
        ]);

        return redirect()->route('plan-requests.index')->with('success', __('Plan request rejected successfully!'));
    }
}
