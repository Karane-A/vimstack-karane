<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Plan;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class CompanyController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()
            ->where('type', 'company')
            ->with('plan');
            
        // Apply search filter
        if ($request->has('search') && !empty($request->search)) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }
        
        // Apply status filter
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        
        // Apply date filters
        if ($request->has('start_date') && !empty($request->start_date)) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        
        if ($request->has('end_date') && !empty($request->end_date)) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }
        
        // Apply sorting
        $allowedSortFields = ['id', 'name', 'email', 'status', 'created_at', 'updated_at', 'plan_expire_date'];
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        
        // Validate sort field
        if (!in_array($sortField, $allowedSortFields)) {
            $sortField = 'created_at';
        }
        
        $query->orderBy($sortField, $sortDirection);
        
        // Get paginated results
        $perPage = $request->input('per_page', 10);
        $companies = $query->paginate($perPage)->withQueryString();
        
        // Transform data for frontend
        $companies->getCollection()->transform(function ($company) {
            return [
                'id' => $company->id,
                'name' => $company->name,
                'email' => $company->email,
                'status' => $company->status,
                'created_at' => $company->created_at,
                'plan_name' => $company->plan ? $company->plan->name : __('No Plan'),
                'plan_expiry_date' => $company->plan_expire_date,
            ];
        });
        
        // Get plans for dropdown
        $plans = Plan::all(['id', 'name']);
        
        return Inertia::render('companies/index', [
            'companies' => $companies,
            'plans' => $plans,
            'filters' => $request->only(['search', 'status', 'start_date', 'end_date', 'sort_field', 'sort_direction', 'per_page'])
        ]);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'nullable|string|min:8',
            'status' => 'required|in:active,inactive',
        ]);
        
        try {
            $company = new User();
            $company->name = $validated['name'];
            $company->email = $validated['email'];
            
            // Only set password if provided
            if (isset($validated['password'])) {
                $company->password = Hash::make($validated['password']);
            }
            
            $company->type = 'company';
            $company->status = $validated['status'];
            
            // Set company language same as creator (superadmin)
            $creator = auth()->user();
            if ($creator && $creator->lang) {
                $company->lang = $creator->lang;
            }
            
            // Assign default plan
            $defaultPlan = Plan::where('is_default', true)->first();
            if ($defaultPlan) {
                $company->plan_id = $defaultPlan->id;
                
                // Set plan expiry date based on plan duration
                if ($defaultPlan->duration === 'yearly') {
                    $company->plan_expire_date = now()->addYear();
                } else {
                    $company->plan_expire_date = now()->addMonth();
                }
                
                // Set plan is active
                $company->plan_is_active = 1;
            }
            
            $company->save();
            
            // Assign role and settings to the user
            defaultRoleAndSetting($company);
            
            // Trigger email notification
            event(new \App\Events\UserCreated($company, $validated['password'] ?? ''));
            
            // Check for email errors
            if (session()->has('email_error')) {
                $warningMessage = __('Company created successfully, but welcome email failed: ') . session('email_error');
                
                if ($request->expectsJson()) {
                    return response()->json([
                        'success' => true,
                        'message' => $warningMessage,
                        'type' => 'warning'
                    ]);
                }
                
                return redirect()->back()->with('warning', $warningMessage);
            }
            
            $successMessage = __('Company created successfully');
            
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => $successMessage
                ]);
            }
            
            return redirect()->back()->with('success', $successMessage);
            
        } catch (\Exception $e) {
            \Log::error('Company creation failed: ' . $e->getMessage());
            
            $errorMessage = __('Failed to create company. Please try again.');
            
            if ($request->expectsJson()) {
                return response()->json(['error' => $errorMessage], 500);
            }
            
            return redirect()->back()->with('error', $errorMessage);
        }
    }
    
    public function update(Request $request, User $company)
    {
        // Ensure this is a company type user
        if ($company->type !== 'company') {
            if ($request->expectsJson()) {
                return response()->json(['error' => __('Invalid company record')], 400);
            }
            return redirect()->back()->with('error', __('Invalid company record'));
        }
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $company->id,
            'status' => 'required|in:active,inactive',
        ]);
        
        try {
            $company->name = $validated['name'];
            $company->email = $validated['email'];
            $company->status = $validated['status'];
            
            $company->save();
            
            $successMessage = __('Company updated successfully');
            
            if ($request->expectsJson()) {
                return response()->json(['success' => true, 'message' => $successMessage]);
            }
            
            return redirect()->back()->with('success', $successMessage);
            
        } catch (\Exception $e) {
            \Log::error('Company update failed: ' . $e->getMessage());
            
            $errorMessage = __('Failed to update company. Please try again.');
            
            if ($request->expectsJson()) {
                return response()->json(['error' => $errorMessage], 500);
            }
            
            return redirect()->back()->with('error', $errorMessage);
        }
    }
    
    public function destroy(Request $request, User $company)
    {
        // Ensure this is a company type user
        if ($company->type !== 'company') {
            if ($request->expectsJson()) {
                return response()->json(['error' => __('Invalid company record')], 400);
            }
            return redirect()->back()->with('error', __('Invalid company record'));
        }
        
        try {
            $company->delete();
            
            $successMessage = __('Company deleted successfully');
            
            if ($request->expectsJson()) {
                return response()->json(['success' => true, 'message' => $successMessage]);
            }
            
            return redirect()->back()->with('success', $successMessage);
            
        } catch (\Exception $e) {
            \Log::error('Company deletion failed: ' . $e->getMessage());
            
            $errorMessage = __('Failed to delete company. Please try again.');
            
            if ($request->expectsJson()) {
                return response()->json(['error' => $errorMessage], 500);
            }
            
            return redirect()->back()->with('error', $errorMessage);
        }
    }
    
    public function resetPassword(Request $request, User $company)
    {
        // Ensure this is a company type user
        if ($company->type !== 'company') {
            if ($request->expectsJson()) {
                return response()->json(['error' => __('Invalid company record')], 400);
            }
            return redirect()->back()->with('error', __('Invalid company record'));
        }
        
        $validated = $request->validate([
            'password' => ['required', 'string', 'min:8'],
        ]);
        
        try {
            $company->password = Hash::make($validated['password']);
            $company->save();
            
            $successMessage = __('Password reset successfully');
            
            if ($request->expectsJson()) {
                return response()->json(['success' => true, 'message' => $successMessage]);
            }
            
            return redirect()->back()->with('success', $successMessage);
            
        } catch (\Exception $e) {
            \Log::error('Password reset failed: ' . $e->getMessage());
            
            $errorMessage = __('Failed to reset password. Please try again.');
            
            if ($request->expectsJson()) {
                return response()->json(['error' => $errorMessage], 500);
            }
            
            return redirect()->back()->with('error', $errorMessage);
        }
    }
    
    public function toggleStatus(Request $request, User $company)
    {
        // Ensure this is a company type user
        if ($company->type !== 'company') {
            if ($request->expectsJson()) {
                return response()->json(['error' => __('Invalid company record')], 400);
            }
            return redirect()->back()->with('error', __('Invalid company record'));
        }
        
        try {
            $company->status = $company->status === 'active' ? 'inactive' : 'active';
            $company->save();
            
            $successMessage = __('Company status updated successfully');
            
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true, 
                    'message' => $successMessage,
                    'status' => $company->status
                ]);
            }
            
            return redirect()->back()->with('success', $successMessage);
            
        } catch (\Exception $e) {
            \Log::error('Status toggle failed: ' . $e->getMessage());
            
            $errorMessage = __('Failed to update status. Please try again.');
            
            if ($request->expectsJson()) {
                return response()->json(['error' => $errorMessage], 500);
            }
            
            return redirect()->back()->with('error', $errorMessage);
        }
    }
    
    /**
     * Get available plans for upgrade
     */
    public function getPlans(User $company)
    {
        // Ensure this is a company type user
        if ($company->type !== 'company') {
            return response()->json(['error' => __('Invalid company record')], 400);
        }
        
        $plans = Plan::where('is_plan_enable', 'on')->get();
        
        $formattedPlans = $plans->map(function ($plan) use ($company) {
            // Format features
            $features = [];
            if ($plan->enable_custdomain === 'on') $features[] = __('Custom Domain');
            if ($plan->enable_custsubdomain === 'on') $features[] = __('Subdomain');
            if ($plan->enable_chatgpt === 'on') $features[] = __('AI Integration');
            
            // Calculate yearly price
            $yearlyPrice = $plan->yearly_price;
            if ($yearlyPrice === null) {
                $yearlyPrice = $plan->price * 12 * 0.8;
            }
            
            return [
                'id' => $plan->id,
                'name' => $plan->name,
                'price' => '$' . number_format($plan->price, 2),
                'yearly_price' => '$' . number_format($yearlyPrice, 2),
                'duration' => __('Monthly'),
                'description' => $plan->description,
                'features' => $features,
                'business' => $plan->business,
                'max_users' => $plan->max_users,
                'storage_limit' => $plan->storage_limit . ' ' . __('GB'),
                'is_current' => $company->plan_id === $plan->id,
                'is_default' => $plan->is_default
            ];
        });
        
        return response()->json([
            'plans' => $formattedPlans,
            'company' => [
                'id' => $company->id,
                'name' => $company->name,
                'current_plan_id' => $company->plan_id
            ]
        ]);
    }
    
    /**
     * Upgrade company plan
     */
    public function upgradePlan(Request $request, User $company)
    {
        // Ensure this is a company type user
        if ($company->type !== 'company') {
            if ($request->expectsJson()) {
                return response()->json(['error' => __('Invalid company record')], 400);
            }
            return back()->with('error', __('Invalid company record'));
        }
        
        $validated = $request->validate([
            'plan_id' => 'required|exists:plans,id',
        ]);
        
        $plan = Plan::find($validated['plan_id']);
        if (!$plan) {
            if ($request->expectsJson()) {
                return response()->json(['error' => __('Plan not found')], 404);
            }
            return back()->with('error', __('Plan not found'));
        }
        
        try {
            // Update company plan
            $company->plan_id = $plan->id;
            
            // Set plan expiry date based on plan duration
            if ($plan->duration === 'yearly') {
                $company->plan_expire_date = now()->addYear();
            } else {
                $company->plan_expire_date = now()->addMonth();
            }
            
            // Set plan is active
            $company->plan_is_active = 1;
            
            $company->save();
            
            $successMessage = __('Plan upgraded successfully');
            
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => $successMessage,
                    'company' => [
                        'id' => $company->id,
                        'plan_id' => $company->plan_id,
                        'plan_name' => $plan->name,
                        'plan_expire_date' => $company->plan_expire_date
                    ]
                ]);
            }
            
            return back()->with('success', $successMessage);
            
        } catch (\Exception $e) {
            \Log::error('Plan upgrade failed: ' . $e->getMessage());
            
            $errorMessage = __('Failed to upgrade plan. Please try again.');
            
            if ($request->expectsJson()) {
                return response()->json(['error' => $errorMessage], 500);
            }
            
            return back()->with('error', $errorMessage);
        }
    }
}