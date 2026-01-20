<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Customer;
use App\Models\Product;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class AnalyticsController extends BaseController
{
    public function index()
    {
        $user = Auth::user();
        $storeId = getCurrentStoreId($user);

        if (!$storeId) {
            return Inertia::render('analytics/index', [
                'analytics' => $this->getEmptyAnalytics()
            ]);
        }

        $analytics = [
            'metrics' => $this->getKeyMetrics($storeId),
            'topProducts' => $this->getTopProducts($storeId),
            'topCustomers' => $this->getTopCustomers($storeId),
            'recentActivity' => $this->getRecentActivity($storeId),
            'revenueChart' => $this->getRevenueChartData($storeId),
            'salesChart' => $this->getSalesChartData($storeId),
            'monthlyRevenueBreakdown' => $this->getMonthlyRevenueBreakdown($storeId)
        ];
        
        // In demo mode, add dummy data for metrics and charts only when they are zero/null
        if (config('app.is_demo', false)) {
            if ($analytics['metrics']['revenue']['current'] == 0 && $analytics['metrics']['orders']['current'] == 0) {
                $analytics['metrics'] = [
                    'revenue' => ['current' => 45250.75, 'change' => 12.5],
                    'orders' => ['current' => 156, 'change' => 23],
                    'customers' => ['total' => 342, 'new' => 28]
                ];
            }
            if (empty($analytics['revenueChart']) || count($analytics['revenueChart']) == 0) {
                $analytics['revenueChart'] = $this->getDemoRevenueChart();
            }
            if (empty($analytics['salesChart']) || count($analytics['salesChart']) == 0) {
                $analytics['salesChart'] = $this->getDemoSalesChart();
            }
        }

        return Inertia::render('analytics/index', [
            'analytics' => $analytics
        ]);
    }

    private function getKeyMetrics($storeId)
    {
        $currentMonth = Carbon::now()->startOfMonth();
        $lastMonth = Carbon::now()->subMonth()->startOfMonth();
        $thirtyDaysAgo = Carbon::now()->subDays(30);

        // Basic totals
        $totalOrders = Order::where('store_id', $storeId)->count();
        $totalRevenue = Order::where('store_id', $storeId)->sum('total_amount');
        $totalCustomers = Customer::where('store_id', $storeId)->count();
        $totalProducts = Product::where('store_id', $storeId)->count();

        // Current month metrics
        $currentRevenue = Order::where('store_id', $storeId)
            ->where('created_at', '>=', $currentMonth)
            ->sum('total_amount');

        $lastMonthRevenue = Order::where('store_id', $storeId)
            ->whereBetween('created_at', [$lastMonth, $currentMonth])
            ->sum('total_amount');

        $currentOrders = Order::where('store_id', $storeId)
            ->where('created_at', '>=', $currentMonth)
            ->count();

        $lastMonthOrders = Order::where('store_id', $storeId)
            ->whereBetween('created_at', [$lastMonth, $currentMonth])
            ->count();

        $newCustomers = Customer::where('store_id', $storeId)
            ->where('created_at', '>=', $currentMonth)
            ->count();

        // Monthly growth percentage
        $monthlyGrowth = $lastMonthRevenue > 0 
            ? (($currentRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100 
            : 0;

        // Average order value
        $avgOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;

        // Conversion rate (orders per customer)
        $conversionRate = $totalCustomers > 0 ? ($totalOrders / $totalCustomers) * 100 : 0;

        // Active products (sold in last 30 days)
        $activeProducts = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.store_id', $storeId)
            ->where('orders.created_at', '>=', $thirtyDaysAgo)
            ->distinct('order_items.product_id')
            ->count('order_items.product_id');

        // Repeat customer rate (customers with 2+ orders)
        $repeatCustomers = DB::table('orders')
            ->select('customer_email')
            ->where('store_id', $storeId)
            ->groupBy('customer_email')
            ->havingRaw('COUNT(*) >= 2')
            ->get()
            ->count();

        $repeatRate = $totalCustomers > 0 ? ($repeatCustomers / $totalCustomers) * 100 : 0;

        return [
            'revenue' => [
                'total' => $totalRevenue,
                'current' => $currentRevenue,
                'change' => $lastMonthRevenue > 0 ? (($currentRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100 : 0,
                'monthlyGrowth' => round($monthlyGrowth, 2),
                'avgOrderValue' => $avgOrderValue
            ],
            'orders' => [
                'total' => $totalOrders,
                'current' => $currentOrders,
                'change' => $currentOrders - $lastMonthOrders
            ],
            'customers' => [
                'total' => $totalCustomers,
                'new' => $newCustomers,
                'repeatRate' => round($repeatRate, 2),
                'repeatCount' => $repeatCustomers
            ],
            'products' => [
                'total' => $totalProducts,
                'active' => $activeProducts
            ],
            'conversionRate' => round($conversionRate, 2)
        ];
    }

    private function getTopProducts($storeId)
    {
        return OrderItem::select('product_name', 'product_id')
            ->selectRaw('SUM(quantity) as total_sold')
            ->selectRaw('SUM(total_price) as total_revenue')
            ->whereHas('order', function($query) use ($storeId) {
                $query->where('store_id', $storeId);
            })
            ->groupBy('product_id', 'product_name')
            ->orderBy('total_revenue', 'desc')
            ->limit(4)
            ->get()
            ->map(function($item) use ($storeId) {
                $user = Auth::user();
                return [
                    'name' => $item->product_name,
                    'sales' => $item->total_sold,
                    'revenue' => formatStoreCurrency($item->total_revenue, $user->id, $storeId)
                ];
            });
    }

    private function getTopCustomers($storeId)
    {
        return Customer::select('customers.*')
            ->selectRaw('COUNT(orders.id) as order_count')
            ->selectRaw('SUM(orders.total_amount) as total_spent')
            ->leftJoin('orders', 'customers.id', '=', 'orders.customer_id')
            ->where('customers.store_id', $storeId)
            ->groupBy('customers.id')
            ->orderBy('total_spent', 'desc')
            ->limit(4)
            ->get()
            ->map(function($customer) use ($storeId) {
                $user = Auth::user();
                return [
                    'name' => $customer->first_name . ' ' . $customer->last_name,
                    'orders' => $customer->order_count ?: 0,
                    'spent' => formatStoreCurrency($customer->total_spent ?: 0, $user->id, $storeId)
                ];
            });
    }

    private function getRecentActivity($storeId)
    {
        return Order::where('store_id', $storeId)
            ->with('customer')
            ->orderBy('created_at', 'desc')
            ->limit(4)
            ->get()
            ->map(function($order) use ($storeId) {
                $user = Auth::user();
                return [
                    'type' => 'Order',
                    'description' => "New order {$order->order_number} from {$order->customer_first_name} {$order->customer_last_name}",
                    'amount' => formatStoreCurrency($order->total_amount, $user->id, $storeId),
                    'time' => $order->created_at->diffForHumans()
                ];
            });
    }

    private function getRevenueChartData($storeId)
    {
        return Order::where('store_id', $storeId)
            ->selectRaw('DATE(created_at) as date, SUM(total_amount) as revenue')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function($item) {
                return [
                    'date' => Carbon::parse($item->date)->format('M d'),
                    'revenue' => (float) $item->revenue
                ];
            });
    }

    private function getSalesChartData($storeId)
    {
        return Order::where('store_id', $storeId)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as orders')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function($item) {
                return [
                    'date' => Carbon::parse($item->date)->format('M d'),
                    'orders' => (int) $item->orders
                ];
            });
    }
    
    private function getMonthlyRevenueBreakdown($storeId)
    {
        $monthlyData = [];
        for ($i = 5; $i >= 0; $i--) {
            $monthStart = Carbon::now()->subMonths($i)->startOfMonth();
            $monthEnd = Carbon::now()->subMonths($i)->endOfMonth();
            
            $revenue = Order::where('store_id', $storeId)
                ->whereBetween('created_at', [$monthStart, $monthEnd])
                ->sum('total_amount');
            
            $monthlyData[] = [
                'month' => $monthStart->format('M Y'),
                'revenue' => $revenue
            ];
        }
        return $monthlyData;
    }

    private function getEmptyAnalytics()
    {
        return [
            'metrics' => [
                'revenue' => ['current' => 0, 'change' => 0],
                'orders' => ['current' => 0, 'change' => 0],
                'customers' => ['total' => 0, 'new' => 0],

            ],
            'topProducts' => [],
            'topCustomers' => [],
            'recentActivity' => [],
            'revenueChart' => [],
            'salesChart' => []
        ];
    }
    
    private function getDemoRevenueChart()
    {
        $data = [];
        $baseRevenue = 800;
        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $revenue = $baseRevenue + rand(-200, 400) + ($i < 15 ? rand(100, 300) : 0);
            $data[] = [
                'date' => $date->format('M d'),
                'revenue' => (float) $revenue
            ];
        }
        return $data;
    }
    
    private function getDemoSalesChart()
    {
        $data = [];
        $baseOrders = 8;
        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $orders = $baseOrders + rand(-3, 7) + ($i < 15 ? rand(2, 5) : 0);
            $data[] = [
                'date' => $date->format('M d'),
                'orders' => max(0, (int) $orders)
            ];
        }
        return $data;
    }
    
    /**
     * Export analytics data as CSV.
     */
    public function export()
    {
        $user = Auth::user();
        $storeId = getCurrentStoreId($user);
        
        if (!$storeId) {
            return response()->json(['error' => 'No store selected'], 400);
        }
        
        $analytics = [
            'metrics' => $this->getKeyMetrics($storeId),
            'topProducts' => $this->getTopProducts($storeId),
            'topCustomers' => $this->getTopCustomers($storeId),
            'revenueChart' => $this->getRevenueChartData($storeId),
            'monthlyRevenueBreakdown' => $this->getMonthlyRevenueBreakdown($storeId)
        ];
        
        $csvData = [];
        $csvData[] = ['Analytics Export - Store ID: ' . $storeId];
        $csvData[] = ['Generated on: ' . now()->format('Y-m-d H:i:s')];
        $csvData[] = [];
        
        // Enhanced Key Metrics
        $csvData[] = ['KEY PERFORMANCE METRICS'];
        $csvData[] = ['Metric', 'Current Value', 'Additional Info'];
        $csvData[] = ['Total Revenue', formatStoreCurrency($analytics['metrics']['revenue']['total'], $user->id, $storeId), ''];
        $csvData[] = ['Monthly Revenue', formatStoreCurrency($analytics['metrics']['revenue']['current'], $user->id, $storeId), number_format($analytics['metrics']['revenue']['change'], 1) . '% change'];
        $csvData[] = ['Average Order Value', formatStoreCurrency($analytics['metrics']['revenue']['avgOrderValue'], $user->id, $storeId), ''];
        $csvData[] = ['Conversion Rate', number_format($analytics['metrics']['conversionRate'], 2) . '%', ''];
        $csvData[] = [];
        
        // Orders & Customers
        $csvData[] = ['ORDERS & CUSTOMERS'];
        $csvData[] = ['Metric', 'Value'];
        $csvData[] = ['Total Orders', $analytics['metrics']['orders']['total']];
        $csvData[] = ['Current Month Orders', $analytics['metrics']['orders']['current']];
        $csvData[] = ['Total Customers', $analytics['metrics']['customers']['total']];
        $csvData[] = ['New Customers', $analytics['metrics']['customers']['new']];
        $csvData[] = ['Repeat Customer Rate', number_format($analytics['metrics']['customers']['repeatRate'], 2) . '%'];
        $csvData[] = ['Repeat Customers', $analytics['metrics']['customers']['repeatCount']];
        $csvData[] = [];
        
        // Product Performance
        $csvData[] = ['PRODUCT PERFORMANCE'];
        $csvData[] = ['Metric', 'Value'];
        $csvData[] = ['Total Products', $analytics['metrics']['products']['total']];
        $csvData[] = ['Active Products (Last 30 Days)', $analytics['metrics']['products']['active']];
        $csvData[] = [];
        
        // Monthly Revenue Breakdown
        $csvData[] = ['MONTHLY REVENUE BREAKDOWN (Last 6 Months)'];
        $csvData[] = ['Month', 'Revenue'];
        foreach ($analytics['monthlyRevenueBreakdown'] as $month) {
            $csvData[] = [$month['month'], formatStoreCurrency($month['revenue'], $user->id, $storeId)];
        }
        $csvData[] = [];
        
        // Top Products
        $csvData[] = ['TOP PRODUCTS'];
        $csvData[] = ['Product Name', 'Units Sold', 'Revenue'];
        foreach ($analytics['topProducts'] as $product) {
            $csvData[] = [$product['name'], $product['sales'], $product['revenue']];
        }
        $csvData[] = [];
        
        // Top Customers
        $csvData[] = ['TOP CUSTOMERS'];
        $csvData[] = ['Customer Name', 'Orders', 'Total Spent'];
        foreach ($analytics['topCustomers'] as $customer) {
            $csvData[] = [$customer['name'], $customer['orders'], $customer['spent']];
        }
        $csvData[] = [];
        
        // Daily Revenue Chart Data
        $csvData[] = ['DAILY REVENUE (Last 30 Days)'];
        $csvData[] = ['Date', 'Revenue'];
        foreach ($analytics['revenueChart'] as $data) {
            $csvData[] = [$data['date'], formatStoreCurrency($data['revenue'], $user->id, $storeId)];
        }
        
        $filename = 'analytics-export-' . now()->format('Y-m-d') . '.csv';
        
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