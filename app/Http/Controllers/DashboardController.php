<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Store;
use App\Models\Order;
use App\Models\Product;
use App\Models\Customer;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\Plan;
use App\Models\PlanOrder;
use App\Models\PlanRequest;
use App\Models\Coupon;
use App\Models\Ticket;
use Carbon\Carbon;
function formatStoreCurrency($amount, $userId, $storeId) {
    $settings = settings($userId, $storeId);
    $defaultCurrency = $settings['defaultCurrency'] ?? 'USD';
    $currency = \App\Models\Currency::where('code', $defaultCurrency)->first();
    $symbol = $currency ? $currency->symbol : '$';
    return $symbol . number_format($amount, 2);
}

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // Super admin always gets full dashboard
        if ($user->type === 'superadmin' || $user->type === 'super admin') {
            return $this->renderDashboard(true);
        }
        
        // Company users always get full dashboard
        if ($user->type === 'company') {
            return $this->renderDashboard(true);
        }
        
        // Check if user has dashboard permission
        if ($user->can('manage-dashboard')) {
            return $this->renderDashboard(true);
        }
        
        // Show default dashboard for users without permission
        return $this->renderDefaultDashboard();
    }
    
    public function redirectToFirstAvailablePage()
    {
        $user = auth()->user();
        
        // Define available routes with their permissions
        $routes = [
            ['route' => 'users.index', 'permission' => 'manage-users'],
            ['route' => 'roles.index', 'permission' => 'manage-roles'],





            ['route' => 'plans.index', 'permission' => 'manage-plans'],
            ['route' => 'referral.index', 'permission' => 'manage-referral'],
            ['route' => 'settings.index', 'permission' => 'manage-settings'],
        ];
        
        // Find first available route
        foreach ($routes as $routeData) {
            if ($user->hasPermissionTo($routeData['permission'])) {
                return redirect()->route($routeData['route']);
            }
        }
        
        // If no permissions found, logout user
        auth()->logout();
        return redirect()->route('login')->with('error', __('No access permissions found.'));
    }
    
    private function renderDashboard($hasPermission = true)
    {
        $user = auth()->user();
        
        // Super Admin gets system-wide dashboard
        if ($user->isSuperAdmin()) {
            return Inertia::render('dashboard', [
                'dashboardData' => $this->getSuperAdminDashboardData(),
                'currentStore' => null,
                'isSuperAdmin' => true,
                'hasPermission' => true
            ]);
        }
        
        // Regular users get store-based dashboard
        $storeId = getCurrentStoreId($user);
        
        if (!$storeId) {
            return Inertia::render('dashboard', [
                'dashboardData' => $this->getEmptyDashboard(),
                'currentStore' => null,
                'isSuperAdmin' => false,
                'hasPermission' => $hasPermission
            ]);
        }
        
        $currentStore = Store::find($storeId);
        $dashboardData = $this->getDashboardData($storeId);
        
        // Add store URLs to current store data
        if ($currentStore) {
            $currentStore->store_url = getStoreUrl($currentStore);
            $currentStore->qr_code_url = getStoreQrCodeUrl($currentStore);
            $currentStore->copy_link_url = getStoreCopyLinkUrl($currentStore);
            $currentStore->visit_store_url = getStoreVisitUrl($currentStore);
        }
        
        // Get currency settings for company dashboard
        $settings = settings($user->id, $storeId);
        $defaultCurrency = $settings['defaultCurrency'] ?? 'USD';
        $storeCurrency = \App\Models\Currency::where('code', $defaultCurrency)->first();
        
        return Inertia::render('dashboard', [
            'dashboardData' => $dashboardData,
            'currentStore' => $currentStore,
            'storeUrl' => $currentStore ? $currentStore->store_url : null,
            'isSuperAdmin' => false,
            'hasPermission' => $hasPermission,
            'settings' => $settings,
            'storeCurrency' => $storeCurrency ? [
                'code' => $storeCurrency->code,
                'symbol' => $storeCurrency->symbol,
                'name' => $storeCurrency->name
            ] : [
                'code' => 'USD',
                'symbol' => '$',
                'name' => 'US Dollar'
            ]
        ]);
    }
    
    private function renderDefaultDashboard()
    {
        return Inertia::render('default-dashboard', [
            'message' => 'Welcome! You have limited access to the system.',
            'availableActions' => $this->getAvailableActions()
        ]);
    }
    
    private function getAvailableActions()
    {
        $user = auth()->user();
        $actions = [];
        
        // Check available permissions and suggest actions
        if ($user->can('view-stores')) {
            $actions[] = ['title' => 'Stores', 'route' => 'stores.index', 'description' => 'Manage your stores'];
        }
        if ($user->can('view-products')) {
            $actions[] = ['title' => 'Products', 'route' => 'products.index', 'description' => 'Manage products'];
        }
        if ($user->can('view-orders')) {
            $actions[] = ['title' => 'Orders', 'route' => 'orders.index', 'description' => 'View orders'];
        }
        if ($user->can('view-customers')) {
            $actions[] = ['title' => 'Customers', 'route' => 'customers.index', 'description' => 'Manage customers'];
        }
        
        return $actions;
    }
    
    private function getDashboardData($storeId)
    {
        $currentMonth = Carbon::now()->startOfMonth();
        $lastMonth = Carbon::now()->subMonth()->startOfMonth();
        
        $totalOrders = Order::where('store_id', $storeId)->count();
        $totalProducts = Product::where('store_id', $storeId)->count();
        $totalCustomers = Customer::where('store_id', $storeId)->count();
        $totalRevenue = Order::where('store_id', $storeId)->sum('total_amount');
        
        $recentOrders = Order::where('store_id', $storeId)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer' => $order->customer_first_name . ' ' . $order->customer_last_name,
                    'amount' => $order->total_amount,
                    'status' => $order->status,
                    'date' => $order->created_at->diffForHumans()
                ];
            });
            
        $topProducts = OrderItem::select('product_id', 'product_name')
            ->selectRaw('SUM(quantity) as total_sold')
            ->whereHas('order', function($query) use ($storeId) {
                $query->where('store_id', $storeId);
            })
            ->groupBy('product_id', 'product_name')
            ->orderBy('total_sold', 'desc')
            ->limit(5)
            ->get()
            ->map(function($item) {
                $product = Product::find($item->product_id);
                return [
                    'id' => $item->product_id,
                    'name' => $item->product_name,
                    'sold' => $item->total_sold,
                    'price' => $product ? $product->price : 0
                ];
            });
        
        return [
            'metrics' => [
                'orders' => $totalOrders,
                'products' => $totalProducts,
                'customers' => $totalCustomers,
                'revenue' => $totalRevenue
            ],
            'recentOrders' => $recentOrders,
            'topProducts' => $topProducts
        ];
    }
    
    private function getSuperAdminDashboardData()
    {
        $currentMonth = Carbon::now()->startOfMonth();
        $lastMonth = Carbon::now()->subMonth()->startOfMonth();
        
        // System-wide metrics
        $totalCompanies = User::where('type', 'company')->count();
        $totalPlans = Plan::count();
        $activePlans = Plan::where('is_plan_enable', 'on')->count();
        $totalRevenue = PlanOrder::where('status', 'approved')->sum('final_price');
        $monthlyRevenue = PlanOrder::where('status', 'approved')
            ->where('created_at', '>=', $currentMonth)
            ->sum('final_price');
        $lastMonthRevenue = PlanOrder::where('status', 'approved')
            ->whereBetween('created_at', [$lastMonth, $currentMonth])
            ->sum('final_price');
        
        $monthlyGrowth = $lastMonthRevenue > 0 
            ? (($monthlyRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100 
            : 0;
        
        // In demo mode, show only positive growth values
        if (config('app.is_demo', false) && $monthlyGrowth < 0) {
            $monthlyGrowth = abs($monthlyGrowth);
        }
        
        // Plan orders
        $pendingOrders = PlanOrder::where('status', 'pending')->count();
        $approvedOrders = PlanOrder::where('status', 'approved')->count();
        $totalOrders = PlanOrder::count();
        
        // Plan requests
        $pendingRequests = PlanRequest::where('status', 'pending')->count();
        
        // Coupons
        $activeCoupons = Coupon::where('status', true)
            ->where(function($query) {
                $query->whereNull('expiry_date')
                      ->orWhere('expiry_date', '>=', now());
            })
            ->count();
        $totalCoupons = Coupon::count();
        
        // Recent activities (plan orders) - Get diverse activities from different companies
        $recentOrders = PlanOrder::with(['user', 'plan'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy('user_id')
            ->map(function($userOrders) {
                return $userOrders->first(); // Get the most recent order for each user
            })
            ->take(5)
            ->map(function($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'company' => $order->user->name,
                    'plan' => $order->plan->name,
                    'amount' => $order->final_price,
                    'status' => $order->status,
                    'date' => $order->created_at->diffForHumans()
                ];
            })
            ->values();
        
        // Top performing plans
        $topPlans = PlanOrder::select('plan_id')
            ->selectRaw('COUNT(*) as order_count, SUM(final_price) as total_revenue')
            ->where('status', 'approved')
            ->with('plan')
            ->groupBy('plan_id')
            ->orderBy('total_revenue', 'desc')
            ->limit(5)
            ->get()
            ->map(function($item) {
                return [
                    'id' => $item->plan_id,
                    'name' => $item->plan->name,
                    'orders' => $item->order_count,
                    'revenue' => $item->total_revenue,
                    'price' => $item->plan->price
                ];
            });
        
        return [
            'metrics' => [
                'totalCompanies' => $totalCompanies,
                'totalPlans' => $totalPlans,
                'activePlans' => $activePlans,
                'totalRevenue' => $totalRevenue,
                'monthlyRevenue' => $monthlyRevenue,
                'monthlyGrowth' => round($monthlyGrowth, 2),
                'pendingRequests' => $pendingRequests,
                'pendingOrders' => $pendingOrders,
                'approvedOrders' => $approvedOrders,
                'totalOrders' => $totalOrders,
                'activeCoupons' => $activeCoupons,
                'totalCoupons' => $totalCoupons,
                'approvalQueue' => $pendingOrders + $pendingRequests,
            ],
            'recentOrders' => $recentOrders,
            'topPlans' => $topPlans,
            'systemStats' => [
                'totalUsers' => User::count(),
                'activeUsers' => User::where('is_enable_login', 1)->count(),
                'totalStores' => \App\Models\Store::count(),
                'activeStores' => \App\Models\Store::where('is_active', true)->count(),
                'avgMerchantsPerStore' => $totalCompanies > 0 ? round(\App\Models\Store::count() / $totalCompanies, 1) : 0,
                'planUtilization' => $totalPlans > 0 ? round(($activePlans / $totalPlans) * 100, 1) : 0,
            ],
            'pendingSupportTickets' => Ticket::where('status', 'open')->count(),
            'criticalSupportTickets' => Ticket::with('user')
                ->where('status', 'open')
                ->where('priority', 'critical')
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function($ticket) {
                    return [
                        'id' => $ticket->id,
                        'ticket_number' => $ticket->ticket_number,
                        'subject' => $ticket->subject,
                        'company' => $ticket->user->name,
                        'date' => $ticket->created_at->diffForHumans(),
                    ];
                }),
        ];
        
        // Calculate monthly revenue for the last 12 months
        $monthlyRevenueData = [];
        for ($i = 11; $i >= 0; $i--) {
            $monthStart = Carbon::now()->subMonths($i)->startOfMonth();
            $monthEnd = Carbon::now()->subMonths($i)->endOfMonth();
            
            $revenue = PlanOrder::where('status', 'approved')
                ->whereBetween('created_at', [$monthStart, $monthEnd])
                ->sum('final_price');
            
            $monthlyRevenueData[] = [
                'month' => $monthStart->format('M'),
                'revenue' => $revenue,
                'monthIndex' => 11 - $i
            ];
        }
        
        return [
            'metrics' => [
                'totalCompanies' => $totalCompanies,
                'totalPlans' => $totalPlans,
                'activePlans' => $activePlans,
                'totalRevenue' => $totalRevenue,
                'monthlyRevenue' => $monthlyRevenue,
                'monthlyGrowth' => round($monthlyGrowth, 2),
                'pendingRequests' => $pendingRequests,
                'pendingOrders' => $pendingOrders,
                'approvedOrders' => $approvedOrders,
                'totalOrders' => $totalOrders,
                'activeCoupons' => $activeCoupons,
                'totalCoupons' => $totalCoupons,
                'approvalQueue' => $pendingOrders + $pendingRequests,
            ],
            'recentOrders' => $recentOrders,
            'topPlans' => $topPlans,
            'monthlyRevenueBreakdown' => $monthlyRevenueData,
            'systemStats' => [
                'totalUsers' => User::count(),
                'activeUsers' => User::where('is_enable_login', 1)->count(),
                'totalStores' => \App\Models\Store::count(),
                'activeStores' => \App\Models\Store::where('is_active', true)->count(),
                'avgMerchantsPerStore' => $totalCompanies > 0 ? round(\App\Models\Store::count() / $totalCompanies, 1) : 0,
                'planUtilization' => $totalPlans > 0 ? round(($activePlans / $totalPlans) * 100, 1) : 0,
            ],
            'pendingSupportTickets' => Ticket::where('status', 'open')->count(),
            'criticalSupportTickets' => Ticket::with('user')
                ->where('status', 'open')
                ->where('priority', 'critical')
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function($ticket) {
                    return [
                        'id' => $ticket->id,
                        'ticket_number' => $ticket->ticket_number,
                        'subject' => $ticket->subject,
                        'company' => $ticket->user->name,
                        'date' => $ticket->created_at->diffForHumans(),
                    ];
                }),
        ];
    }
    
    private function getEmptyDashboard()
    {
        return [
            'metrics' => [
                'orders' => 0,
                'products' => 0,
                'customers' => 0,
                'revenue' => 0
            ],
            'recentOrders' => [],
            'topProducts' => []
        ];
    }
    
    public function export()
    {
        $user = auth()->user();
        
        if ($user->isSuperAdmin()) {
            return $this->exportSuperAdminDashboard();
        }
        
        $storeId = getCurrentStoreId($user);
        
        if (!$storeId) {
            return response()->json(['error' => 'No store selected'], 400);
        }
        
        $store = Store::find($storeId);
        $dashboardData = $this->getDashboardData($storeId);
        
        $csvData = [];
        $csvData[] = ['Dashboard Export - ' . $store->name];
        $csvData[] = ['Generated on: ' . now()->format('Y-m-d H:i:s')];
        $csvData[] = [];
        
        // Metrics
        $csvData[] = ['METRICS'];
        $csvData[] = ['Total Orders', $dashboardData['metrics']['orders']];
        $csvData[] = ['Total Products', $dashboardData['metrics']['products']];
        $csvData[] = ['Total Customers', $dashboardData['metrics']['customers']];
        $csvData[] = ['Total Revenue', formatStoreCurrency($dashboardData['metrics']['revenue'], $user->id, $storeId)];
        $csvData[] = [];
        
        // Recent Orders
        $csvData[] = ['RECENT ORDERS'];
        $csvData[] = ['Order Number', 'Customer', 'Amount', 'Status'];
        foreach ($dashboardData['recentOrders'] as $order) {
            $csvData[] = [$order['order_number'], $order['customer'], formatStoreCurrency($order['amount'], $user->id, $storeId), $order['status']];
        }
        $csvData[] = [];
        
        // Top Products
        $csvData[] = ['TOP PRODUCTS'];
        $csvData[] = ['Product Name', 'Units Sold', 'Price'];
        foreach ($dashboardData['topProducts'] as $product) {
            $csvData[] = [$product['name'], $product['sold'], formatStoreCurrency($product['price'], $user->id, $storeId)];
        }
        
        $filename = 'dashboard-export-' . $store->slug . '-' . now()->format('Y-m-d') . '.csv';
        
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
    
    private function exportSuperAdminDashboard()
    {
        $dashboardData = $this->getSuperAdminDashboardData();
        
        $csvData = [];
        $csvData[] = ['Super Admin Dashboard Export'];
        $csvData[] = ['Generated on: ' . now()->format('Y-m-d H:i:s')];
        $csvData[] = [];
        
        // System Metrics
        $csvData[] = ['SYSTEM OVERVIEW'];
        $csvData[] = ['Total Companies', $dashboardData['metrics']['totalCompanies']];
        $csvData[] = ['Total Revenue', '$' . number_format($dashboardData['metrics']['totalRevenue'], 2)];
        $csvData[] = ['Monthly Growth', $dashboardData['metrics']['monthlyGrowth'] . '%'];
        $csvData[] = ['Monthly Revenue', '$' . number_format($dashboardData['metrics']['monthlyRevenue'], 2)];
        $csvData[] = [];
        
        // Plan Management
        $csvData[] = ['PLAN MANAGEMENT'];
        $csvData[] = ['Active Plans', $dashboardData['metrics']['activePlans']];
        $csvData[] = ['Total Plans', $dashboardData['metrics']['totalPlans']];
        $csvData[] = ['Approved Orders', $dashboardData['metrics']['approvedOrders']];
        $csvData[] = ['Pending Orders', $dashboardData['metrics']['pendingOrders']];
        $csvData[] = ['Pending Requests', $dashboardData['metrics']['pendingRequests']];
        $csvData[] = [];
        
        // System Features
        $csvData[] = ['SYSTEM FEATURES'];
        $csvData[] = ['Active Coupons', $dashboardData['metrics']['activeCoupons']];
        $csvData[] = ['Total Coupons', $dashboardData['metrics']['totalCoupons']];
        if (isset($dashboardData['systemStats'])) {
            $csvData[] = ['Total Users', $dashboardData['systemStats']['totalUsers']];
            $csvData[] = ['Active Users', $dashboardData['systemStats']['activeUsers']];
            $csvData[] = ['Total Stores', $dashboardData['systemStats']['totalStores']];
            $csvData[] = ['Active Stores', $dashboardData['systemStats']['activeStores']];
        }
        $csvData[] = [];
        
        // Recent Orders
        $csvData[] = ['RECENT PLAN ORDERS'];
        $csvData[] = ['Order Number', 'Company', 'Plan', 'Amount', 'Status'];
        foreach ($dashboardData['recentOrders'] as $order) {
            $csvData[] = [$order['order_number'], $order['company'], $order['plan'], '$' . number_format($order['amount'], 2), $order['status']];
        }
        $csvData[] = [];
        
        // Top Plans
        if (!empty($dashboardData['topPlans'])) {
            $csvData[] = ['TOP PERFORMING PLANS'];
            $csvData[] = ['Plan Name', 'Orders', 'Revenue', 'Monthly Price'];
            foreach ($dashboardData['topPlans'] as $plan) {
                $csvData[] = [$plan['name'], $plan['orders'], '$' . number_format($plan['revenue'], 2), '$' . number_format($plan['price'], 2)];
            }
        }
        
        $filename = 'superadmin-dashboard-export-' . now()->format('Y-m-d') . '.csv';
        
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