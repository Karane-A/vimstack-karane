<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CustomerController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $customers = Customer::where('store_id', $currentStoreId)
            ->orderBy('created_at', 'desc')
            ->get();
            
        // Get statistics
        $totalCustomers = Customer::where('store_id', $currentStoreId)->count();
        $activeCustomers = Customer::where('store_id', $currentStoreId)->where('is_active', true)->count();
        $newThisMonth = Customer::where('store_id', $currentStoreId)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        $totalSpent = Customer::where('store_id', $currentStoreId)
            ->where('total_orders', '>', 0)
            ->sum('total_spent');
        $totalOrders = Customer::where('store_id', $currentStoreId)
            ->where('total_orders', '>', 0)
            ->sum('total_orders');
        $avgOrderValue = $totalOrders > 0 ? $totalSpent / $totalOrders : 0;

        return Inertia::render('customers/index', [
            'customers' => $customers,
            'stats' => [
                'totalCustomers' => $totalCustomers,
                'activeCustomers' => $activeCustomers,
                'newThisMonth' => $newThisMonth,
                'avgOrderValue' => round($avgOrderValue, 2)
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('customers/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other,prefer_not_to_say',
            'notes' => 'nullable|string',
            'avatar' => 'nullable|string',
            'is_active' => 'boolean',
            'preferred_language' => 'nullable|string|max:10',
            'customer_group' => 'nullable|string|max:50',
            'email_marketing' => 'boolean',
            'sms_notifications' => 'boolean',
            'order_updates' => 'boolean',
            'billing_address' => 'nullable|array',
            'shipping_address' => 'nullable|array',
            'same_as_billing' => 'boolean'
        ]);

        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);

        // Check if email is already in use for this store
        $existingCustomer = Customer::where('store_id', $currentStoreId)
            ->where('email', $request->email)
            ->first();
            
        if ($existingCustomer) {
            return back()->with('error', 'A customer with this email already exists.');
        }

        // Create customer
        $customer = Customer::create([
            'store_id' => $currentStoreId,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'date_of_birth' => $request->date_of_birth,
            'gender' => $request->gender,
            'notes' => $request->notes,
            'avatar' => $request->avatar,
            'is_active' => $request->is_active,
            'preferred_language' => $request->preferred_language ?? 'en',
            'customer_group' => $request->customer_group ?? 'regular',
            'email_marketing' => $request->email_marketing,
            'sms_notifications' => $request->sms_notifications,
            'order_updates' => $request->order_updates
        ]);

        // Create billing address if provided
        if ($request->billing_address) {
            $billingAddress = $request->billing_address;
            CustomerAddress::create([
                'customer_id' => $customer->id,
                'type' => 'billing',
                'address' => $billingAddress['address'] ?? '',
                'city' => $billingAddress['city'] ?? '',
                'state' => $billingAddress['state'] ?? '',
                'postal_code' => $billingAddress['postal_code'] ?? '',
                'country' => $billingAddress['country'] ?? '',
                'is_default' => true
            ]);
        }

        // Create shipping address if provided
        if ($request->shipping_address && !$request->same_as_billing) {
            $shippingAddress = $request->shipping_address;
            CustomerAddress::create([
                'customer_id' => $customer->id,
                'type' => 'shipping',
                'address' => $shippingAddress['address'] ?? '',
                'city' => $shippingAddress['city'] ?? '',
                'state' => $shippingAddress['state'] ?? '',
                'postal_code' => $shippingAddress['postal_code'] ?? '',
                'country' => $shippingAddress['country'] ?? '',
                'is_default' => true
            ]);
        } elseif ($request->same_as_billing && $request->billing_address) {
            // Use billing address as shipping address
            $billingAddress = $request->billing_address;
            CustomerAddress::create([
                'customer_id' => $customer->id,
                'type' => 'shipping',
                'address' => $billingAddress['address'] ?? '',
                'city' => $billingAddress['city'] ?? '',
                'state' => $billingAddress['state'] ?? '',
                'postal_code' => $billingAddress['postal_code'] ?? '',
                'country' => $billingAddress['country'] ?? '',
                'is_default' => true
            ]);
        }

        return redirect()->route('customers.index')
            ->with('success', 'Customer created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $customer = Customer::where('store_id', $currentStoreId)
            ->with(['addresses'])
            ->findOrFail($id);
        
        // Calculate dynamic customer statistics from actual orders
        $orders = \App\Models\Order::where('customer_id', $customer->id)
                                  ->where('store_id', $currentStoreId)
                                  ->get();
        
        $totalOrders = $orders->count();
        $totalSpent = $orders->where('payment_status', 'paid')->sum('total_amount');
        $avgOrderValue = $totalOrders > 0 ? $totalSpent / $totalOrders : 0;
        $lastOrderDate = $orders->max('created_at');
        $pendingOrders = $orders->where('status', 'pending')->count();
        
        // Add calculated stats to customer data
        $customer->total_orders = $totalOrders;
        $customer->total_spent = $totalSpent;
        $customer->avg_order_value = $avgOrderValue;
        $customer->last_order_date = $lastOrderDate;
        $customer->pending_orders = $pendingOrders;
        $customer->full_name = $customer->first_name . ' ' . $customer->last_name;
        $customer->initials = strtoupper(substr($customer->first_name, 0, 1) . substr($customer->last_name, 0, 1));
        
        $billingAddress = $customer->addresses->where('type', 'billing')->first();
        $shippingAddress = $customer->addresses->where('type', 'shipping')->first();
        
        return Inertia::render('customers/show', [
            'customer' => $customer,
            'billingAddress' => $billingAddress,
            'shippingAddress' => $shippingAddress,
            'recentOrders' => $orders->take(5)->map(function($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'total' => $order->total_amount,
                    'status' => $order->status,
                    'date' => $order->created_at->format('M j, Y')
                ];
            })
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $customer = Customer::where('store_id', $currentStoreId)
            ->with(['addresses'])
            ->findOrFail($id);
        
        $billingAddress = $customer->addresses->where('type', 'billing')->first();
        $shippingAddress = $customer->addresses->where('type', 'shipping')->first();
        
        return Inertia::render('customers/edit', [
            'customer' => $customer,
            'billingAddress' => $billingAddress,
            'shippingAddress' => $shippingAddress,
            'sameAsBilling' => $billingAddress && $shippingAddress && 
                $billingAddress->address === $shippingAddress->address &&
                $billingAddress->city === $shippingAddress->city &&
                $billingAddress->postal_code === $shippingAddress->postal_code
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other,prefer_not_to_say',
            'notes' => 'nullable|string',
            'avatar' => 'nullable|string',
            'is_active' => 'boolean',
            'preferred_language' => 'nullable|string|max:10',
            'customer_group' => 'nullable|string|max:50',
            'email_marketing' => 'boolean',
            'sms_notifications' => 'boolean',
            'order_updates' => 'boolean',
            'billing_address' => 'nullable|array',
            'shipping_address' => 'nullable|array',
            'same_as_billing' => 'boolean'
        ]);

        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $customer = Customer::where('store_id', $currentStoreId)->findOrFail($id);
        
        // Check if email is already in use by another customer
        $existingCustomer = Customer::where('store_id', $currentStoreId)
            ->where('email', $request->email)
            ->where('id', '!=', $id)
            ->first();
            
        if ($existingCustomer) {
            return back()->with('error', 'A customer with this email already exists.');
        }

        // Update customer
        $customer->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'date_of_birth' => $request->date_of_birth,
            'gender' => $request->gender,
            'notes' => $request->notes,
            'avatar' => $request->avatar,
            'is_active' => $request->is_active,
            'preferred_language' => $request->preferred_language ?? 'en',
            'customer_group' => $request->customer_group ?? 'regular',
            'email_marketing' => $request->email_marketing,
            'sms_notifications' => $request->sms_notifications,
            'order_updates' => $request->order_updates
        ]);

        // Update or create billing address
        if ($request->billing_address) {
            $billingAddress = $request->billing_address;
            CustomerAddress::updateOrCreate(
                [
                    'customer_id' => $customer->id,
                    'type' => 'billing',
                    'is_default' => true
                ],
                [
                    'address' => $billingAddress['address'] ?? '',
                    'city' => $billingAddress['city'] ?? '',
                    'state' => $billingAddress['state'] ?? '',
                    'postal_code' => $billingAddress['postal_code'] ?? '',
                    'country' => $billingAddress['country'] ?? ''
                ]
            );
        }

        // Update or create shipping address
        if ($request->shipping_address && !$request->same_as_billing) {
            $shippingAddress = $request->shipping_address;
            CustomerAddress::updateOrCreate(
                [
                    'customer_id' => $customer->id,
                    'type' => 'shipping',
                    'is_default' => true
                ],
                [
                    'address' => $shippingAddress['address'] ?? '',
                    'city' => $shippingAddress['city'] ?? '',
                    'state' => $shippingAddress['state'] ?? '',
                    'postal_code' => $shippingAddress['postal_code'] ?? '',
                    'country' => $shippingAddress['country'] ?? ''
                ]
            );
        } elseif ($request->same_as_billing && $request->billing_address) {
            // Use billing address as shipping address
            $billingAddress = $request->billing_address;
            CustomerAddress::updateOrCreate(
                [
                    'customer_id' => $customer->id,
                    'type' => 'shipping',
                    'is_default' => true
                ],
                [
                    'address' => $billingAddress['address'] ?? '',
                    'city' => $billingAddress['city'] ?? '',
                    'state' => $billingAddress['state'] ?? '',
                    'postal_code' => $billingAddress['postal_code'] ?? '',
                    'country' => $billingAddress['country'] ?? ''
                ]
            );
        }

        return redirect()->route('customers.index')
            ->with('success', 'Customer updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $customer = Customer::where('store_id', $currentStoreId)->findOrFail($id);
        $customer->delete();

        return redirect()->route('customers.index')
            ->with('success', 'Customer deleted successfully!');
    }
    
    /**
     * Export customers data as CSV.
     */
    public function export()
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $customers = Customer::where('store_id', $currentStoreId)
            ->with(['addresses'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        $csvData = [];
        $csvData[] = ['First Name', 'Last Name', 'Email', 'Phone', 'Gender', 'Customer Group', 'Total Orders', 'Total Spent', 'Status', 'Email Marketing', 'Registration Date'];
        
        foreach ($customers as $customer) {
            $csvData[] = [
                $customer->first_name,
                $customer->last_name,
                $customer->email,
                $customer->phone ?: 'Not provided',
                $customer->gender ? ucfirst($customer->gender) : 'Not specified',
                $customer->customer_group ?: 'Regular',
                $customer->total_orders ?: 0,
                formatStoreCurrency($customer->total_spent ?: 0, $user->id, $currentStoreId),
                $customer->is_active ? 'Active' : 'Inactive',
                $customer->email_marketing ? 'Yes' : 'No',
                $customer->created_at->format('Y-m-d H:i:s')
            ];
        }
        
        $filename = 'customers-export-' . now()->format('Y-m-d') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];
        
        $callback = function() use ($csvData) {
            $file = fopen('php://output', 'w');
            foreach ($csvData as $row) {
                fputcsv($file, $row);
            }
            fclose($file);
        };
        
        return response()->stream($callback, 200, $headers);
    }
}