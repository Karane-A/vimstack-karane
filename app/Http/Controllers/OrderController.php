<?php

namespace App\Http\Controllers;

use App\Events\OrderStatusChanged;
use App\Models\Order;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Shipping;
use App\Models\Country;
use App\Models\State;
use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends BaseController
{
    /**
     * Display a listing of orders.
     */
    public function index()
    {
        $user = Auth::user();
        $storeId = getCurrentStoreId($user);
        
        // Get orders for current store
        $orders = Order::where('store_id', $storeId)
            ->with(['customer', 'items'])
            ->orderBy('created_at', 'desc')
            ->get();
            
        // Calculate stats
        $totalOrders = $orders->count();
        $pendingOrders = $orders->where('status', 'pending')->count();
        $totalRevenue = $orders->where('payment_status', 'paid')->sum('total_amount');
        $avgOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;
        
        // Format orders for frontend
        $formattedOrders = $orders->map(function ($order) {
            return [
                'id' => $order->id,
                'orderNumber' => $order->order_number,
                'customer' => $order->customer_first_name . ' ' . $order->customer_last_name,
                'email' => $order->customer_email,
                'total' => (float) $order->total_amount,
                'status' => ucfirst($order->status),
                'items' => $order->items->count(),
                'date' => $order->created_at->format('Y-m-d'),
                'paymentMethod' => $order->payment_method === 'cod' ? 'Cash on Delivery' : ucfirst(str_replace('_', ' ', $order->payment_method)),
            ];
        });
        
        return Inertia::render('orders/index', [
            'orders' => $formattedOrders,
            'stats' => [
                'totalOrders' => $totalOrders,
                'pendingOrders' => $pendingOrders,
                'totalRevenue' => $totalRevenue,
                'avgOrderValue' => $avgOrderValue,
            ]
        ]);
    }

    /**
     * Display the specified order.
     */
    public function show($id)
    {
        $user = Auth::user();
        $storeId = getCurrentStoreId($user);
        
        $order = Order::where('store_id', $storeId)
            ->where('id', $id)
            ->with(['items.product', 'shippingMethod'])
            ->firstOrFail();
            
        $formattedOrder = [
            'id' => $order->id,
            'orderNumber' => $order->order_number,
            'date' => $order->created_at->format('F j, Y'),
            'status' => ucfirst($order->status),
            'paymentStatus' => ucfirst($order->payment_status),
            'paymentMethod' => $order->payment_method === 'cod' ? 'Cash on Delivery' : ucfirst(str_replace('_', ' ', $order->payment_method)),
            'customer' => [
                'name' => $order->customer_first_name . ' ' . $order->customer_last_name,
                'email' => $order->customer_email,
                'phone' => $order->customer_phone,
            ],
            'shippingAddress' => [
                'name' => $order->customer_first_name . ' ' . $order->customer_last_name,
                'street' => $order->shipping_address,
                'city' => \App\Models\City::find($order->shipping_city)->name ?? $order->shipping_city,
                'state' => \App\Models\State::find($order->shipping_state)->name ?? $order->shipping_state,
                'zip' => $order->shipping_postal_code,
                'country' => \App\Models\Country::find($order->shipping_country)->name ?? $order->shipping_country,
            ],
            'items' => $order->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->product_name,
                    'sku' => $item->product_sku,
                    'quantity' => $item->quantity,
                    'price' => (float) $item->unit_price,
                    'image' => $item->product->cover_image ?? '/placeholder.jpg',
                ];
            }),
            'summary' => [
                'subtotal' => (float) $order->subtotal,
                'shipping' => (float) $order->shipping_amount,
                'tax' => (float) $order->tax_amount,
                'discount' => (float) $order->discount_amount,
                'total' => (float) $order->total_amount,
            ],
            'shippingMethod' => $order->shippingMethod->name ?? ' ',
            'trackingNumber' => $order->tracking_number,
            'notes' => $order->notes,
            'createdAt' => $order->created_at->format('M j, Y g:i A'),
            'updatedAt' => $order->updated_at->format('M j, Y g:i A'),
            'stats' => [
                'items_count' => $order->items->count(),
                'total_quantity' => $order->items->sum('quantity'),
                'avg_item_price' => $order->items->count() > 0 ? $order->items->avg('unit_price') : 0,
            ],
            'timeline' => [
                [
                    'status' => 'Order Placed',
                    'date' => $order->created_at->format('M j, Y g:i A'),
                    'completed' => true
                ],
                [
                    'status' => 'Payment Confirmed',
                    'date' => $order->payment_confirmed_at ? $order->payment_confirmed_at->format('M j, Y g:i A') : null,
                    'completed' => $order->payment_status === 'paid'
                ],
                [
                    'status' => 'Order Processing',
                    'date' => $order->processing_at ? $order->processing_at->format('M j, Y g:i A') : null,
                    'completed' => in_array($order->status, ['processing', 'shipped', 'delivered'])
                ],
                [
                    'status' => 'Shipped',
                    'date' => $order->shipped_at ? $order->shipped_at->format('M j, Y g:i A') : null,
                    'completed' => in_array($order->status, ['shipped', 'delivered'])
                ],
                [
                    'status' => 'Delivered',
                    'date' => $order->delivered_at ? $order->delivered_at->format('M j, Y g:i A') : null,
                    'completed' => $order->status === 'delivered'
                ]
            ]
        ];
        
        return Inertia::render('orders/show', [
            'order' => $formattedOrder
        ]);
    }



    /**
     * Show the form for editing the specified order.
     */
    public function edit($id)
    {
        $user = Auth::user();
        $storeId = getCurrentStoreId($user);
        
        $order = Order::where('store_id', $storeId)
            ->where('id', $id)
            ->with(['items.product', 'shippingMethod'])
            ->firstOrFail();
            
        // Get customers for dropdown
        $customers = Customer::where('store_id', $storeId)
            ->select('id', 'first_name', 'last_name', 'email')
            ->get()
            ->map(function ($customer) {
                return [
                    'id' => $customer->id,
                    'name' => $customer->first_name . ' ' . $customer->last_name,
                    'email' => $customer->email,
                ];
            });
            
        // If order has no customer_id but has email, try to find matching customer
        if (!$order->customer_id && $order->customer_email) {
            $matchingCustomer = $customers->firstWhere('email', $order->customer_email);
            if ($matchingCustomer) {
                $order->customer_id = $matchingCustomer['id'];
            }
        }
            
        // Get products for dropdown
        $products = Product::where('store_id', $storeId)
            ->where('is_active', true)
            ->select('id', 'name', 'price', 'sale_price')
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => (float) ($product->sale_price ?? $product->price),
                ];
            });
            
        // Get shipping methods
        $shippingMethods = Shipping::where('store_id', $storeId)
            ->where('is_active', true)
            ->select('id', 'name', 'cost')
            ->get();
            
        // Update products to include variants
        $products = Product::where('store_id', $storeId)
            ->where('is_active', true)
            ->select('id', 'name', 'price', 'sale_price', 'variants')
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => (float) ($product->sale_price ?? $product->price),
                    'variants' => is_string($product->variants) ? json_decode($product->variants, true) : ($product->variants ?? []),
                ];
            });
        
        $formattedOrder = [
            'id' => $order->id,
            'orderNumber' => $order->order_number,
            'status' => $order->status,
            'paymentStatus' => $order->payment_status,
            'paymentMethod' => $order->payment_method,
            'customer' => [
                'id' => $order->customer_id,
                'name' => $order->customer_first_name . ' ' . $order->customer_last_name,
                'email' => $order->customer_email,
                'phone' => $order->customer_phone,
            ],
            'shippingAddress' => [
                'address' => $order->shipping_address,
                'city' => \App\Models\City::find($order->shipping_city)->name ?? $order->shipping_city,
                'state' => \App\Models\State::find($order->shipping_state)->name ?? $order->shipping_state,
                'postalCode' => $order->shipping_postal_code,
                'country' => \App\Models\Country::find($order->shipping_country)->name ?? $order->shipping_country,
            ],
            'items' => $order->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'productId' => $item->product_id,
                    'name' => $item->product_name,
                    'quantity' => $item->quantity,
                    'price' => (float) $item->unit_price,
                ];
            }),
            'summary' => [
                'subtotal' => (float) $order->subtotal,
                'shipping' => (float) $order->shipping_amount,
                'tax' => (float) $order->tax_amount,
                'total' => (float) $order->total_amount,
            ],
            'shippingMethodId' => $order->shipping_method_id,
            'trackingNumber' => $order->tracking_number,
            'notes' => $order->notes,
        ];
        
        return Inertia::render('orders/edit', [
            'order' => $formattedOrder,
            'customers' => $customers,
            'products' => $products,
            'shippingMethods' => $shippingMethods,
        ]);
    }

    /**
     * Update the specified order.
     */
    public function update(Request $request, $id)
    {
        \Log::info('Order update called', ['id' => $id, 'status' => $request->status]);
        
        $user = Auth::user();
        $storeId = getCurrentStoreId($user);
        
        $order = Order::where('store_id', $storeId)
            ->where('id', $id)
            ->firstOrFail();
            
        // Store old status for event
        $oldStatus = $order->status;
        $oldPaymentStatus = $order->payment_status;
        
        // Prepare update data
        $updateData = [
            'status' => $request->status,
            'payment_status' => $request->payment_status,
            'tracking_number' => $request->tracking_number,
            'notes' => $request->notes,
        ];
        
        // Set timestamp fields based on status changes
        if ($oldStatus !== $request->status) {
            switch ($request->status) {
                case 'confirmed':
                    if (!$order->confirmed_at) {
                        $updateData['confirmed_at'] = now();
                    }
                    break;
                case 'processing':
                    if (!$order->processing_at) {
                        $updateData['processing_at'] = now();
                    }
                    break;
                case 'shipped':
                    if (!$order->shipped_at) {
                        $updateData['shipped_at'] = now();
                    }
                    break;
                case 'delivered':
                    if (!$order->delivered_at) {
                        $updateData['delivered_at'] = now();
                    }
                    break;
                case 'cancelled':
                    if (!$order->cancelled_at) {
                        $updateData['cancelled_at'] = now();
                    }
                    break;
                case 'refunded':
                    if (!$order->refunded_at) {
                        $updateData['refunded_at'] = now();
                    }
                    break;
            }
        }
        
        // Set payment confirmation timestamp
        if ($oldPaymentStatus !== $request->payment_status && $request->payment_status === 'paid') {
            if (!$order->payment_confirmed_at) {
                $updateData['payment_confirmed_at'] = now();
            }
        }
        
        $order->update($updateData);
        
        // Dispatch status change event if status actually changed
        if ($oldStatus !== $request->status) {
            event(new OrderStatusChanged($order, $oldStatus));
        }
        
        // Update order items if provided
        if ($request->has('items')) {
            foreach ($request->items as $itemData) {
                if (isset($itemData['id'])) {
                    $orderItem = $order->items()->find($itemData['id']);
                    if ($orderItem && isset($itemData['variants'])) {
                        $orderItem->update([
                            'product_variants' => json_encode($itemData['variants'])
                        ]);
                    }
                }
            }
        }
        
        return redirect()->route('orders.show', $id)->with('success', 'Order updated successfully.');
    }

    /**
     * Remove the specified order.
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $storeId = getCurrentStoreId($user);
        
        $order = Order::where('store_id', $storeId)
            ->where('id', $id)
            ->firstOrFail();
            
        $order->delete();
        
        return redirect()->route('orders.index')->with('success', 'Order deleted successfully.');
    }
    
    /**
     * Export orders data as CSV.
     */
    public function export()
    {
        $user = Auth::user();
        $storeId = getCurrentStoreId($user);
        
        $orders = Order::where('store_id', $storeId)
            ->with(['customer', 'items'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        $csvData = [];
        $csvData[] = ['Order Number', 'Customer Name', 'Email', 'Phone', 'Status', 'Payment Status', 'Payment Method', 'Items Count', 'Subtotal', 'Tax', 'Shipping', 'Total', 'Shipping Address', 'Order Date'];
        
        foreach ($orders as $order) {
            $shippingAddress = $order->shipping_address . ', ' . 
                (City::find($order->shipping_city)->name ?? $order->shipping_city) . ', ' . 
                (State::find($order->shipping_state)->name ?? $order->shipping_state) . ' ' . 
                $order->shipping_postal_code . ', ' . 
                (Country::find($order->shipping_country)->name ?? $order->shipping_country);
                
            $csvData[] = [
                $order->order_number,
                $order->customer_first_name . ' ' . $order->customer_last_name,
                $order->customer_email,
                $order->customer_phone ?: 'Not provided',
                ucfirst($order->status),
                ucfirst($order->payment_status),
                $order->payment_method === 'cod' ? 'Cash on Delivery' : ucfirst(str_replace('_', ' ', $order->payment_method)),
                $order->items->count(),
                formatStoreCurrency($order->subtotal, $user->id, $storeId),
                formatStoreCurrency($order->tax_amount, $user->id, $storeId),
                formatStoreCurrency($order->shipping_amount, $user->id, $storeId),
                formatStoreCurrency($order->total_amount, $user->id, $storeId),
                $shippingAddress,
                $order->created_at->format('Y-m-d H:i:s')
            ];
        }
        
        $filename = 'orders-export-' . now()->format('Y-m-d') . '.csv';
        
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