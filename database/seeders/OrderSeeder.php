<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Store;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Shipping;
use App\Models\StoreCoupon;
use App\Models\Country;
use App\Models\State;
use App\Models\City;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        // Check if order data already exists
        if (Order::exists()) {
            return; // Skip if data exists
        }
        
        $stores = Store::all();

        foreach ($stores as $store) {
            $customers = Customer::where('store_id', $store->id)->get();
            $products = Product::where('store_id', $store->id)->get();
            $shippingMethods = Shipping::where('store_id', $store->id)->get();

            if ($customers->isEmpty() || $products->isEmpty() || $shippingMethods->isEmpty()) {
                continue;
            }

            // First, ensure every customer has at least one order
            foreach ($customers as $customerIndex => $customer) {
                $this->createOrderForCustomer($customer, $products, $shippingMethods, $customerIndex);
            }
            
            // Then create additional random orders
            $additionalOrders = rand(10, 15);
            
            for ($i = 0; $i < $additionalOrders; $i++) {
                $customer = $customers->random();
                $this->createOrderForCustomer($customer, $products, $shippingMethods, $i + $customers->count());
            }
        }

    }

    private function createOrderForCustomer($customer, $products, $shippingMethods, $index)
    {
        $shippingMethod = $shippingMethods->random();
        
        // Better date distribution over last 3 months
        $daysAgo = rand(1, 90) + ($index * 2);
        $createdAt = Carbon::now()->subDays($daysAgo);
        
        // Get available coupons for this store
        $coupons = StoreCoupon::where('store_id', $customer->store_id)->get();
        $useCoupon = rand(1, 100) <= 30; // 30% chance to use a coupon
        $selectedCoupon = $useCoupon && $coupons->isNotEmpty() ? $coupons->random() : null;
        
        // Get random location data
        $country = Country::inRandomOrder()->first();
        $state = State::where('country_id', $country->id)->inRandomOrder()->first();
        $city = City::where('state_id', $state->id)->inRandomOrder()->first();
        
        // Get different location for billing (sometimes same, sometimes different)
        $sameAddress = rand(1, 100) <= 70; // 70% chance same address
        if ($sameAddress) {
            $billingCountry = $country;
            $billingState = $state;
            $billingCity = $city;
        } else {
            $billingCountry = Country::inRandomOrder()->first();
            $billingState = State::where('country_id', $billingCountry->id)->inRandomOrder()->first();
            $billingCity = City::where('state_id', $billingState->id)->inRandomOrder()->first();
        }
        
        $order = Order::create([
            'order_number' => Order::generateOrderNumber(),
            'store_id' => $customer->store_id,
            'customer_id' => $customer->id,
            'status' => $this->getRandomStatus(),
            'payment_status' => $this->getRandomPaymentStatus(),
            'customer_email' => $customer->email,
            'customer_phone' => $customer->phone,
            'customer_first_name' => $customer->first_name,
            'customer_last_name' => $customer->last_name,
            'shipping_address' => fake()->streetAddress(),
            'shipping_city' => $city->id,
            'shipping_state' => $state->id,
            'shipping_postal_code' => fake()->postcode(),
            'shipping_country' => $country->id,
            'billing_address' => fake()->streetAddress(),
            'billing_city' => $billingCity->id,
            'billing_state' => $billingState->id,
            'billing_postal_code' => fake()->postcode(),
            'billing_country' => $billingCountry->id,
            'subtotal' => 0,
            'tax_amount' => 0,
            'discount_amount' => 0,
            'total_amount' => 0,
            'payment_method' => $this->getRandomPaymentMethod(),
            'payment_gateway' => 'stripe',
            'shipping_method_id' => $shippingMethod->id,
            'shipping_amount' => $shippingMethod->cost,
            'created_at' => $createdAt,
            'updated_at' => $createdAt,
        ]);

        // Add 1-4 items per order
        $itemCount = rand(1, 4);
        $subtotal = 0;
        
        for ($j = 0; $j < $itemCount; $j++) {
            $product = $products->random();
            $quantity = rand(1, 3);
            $unitPrice = $product->sale_price ?? $product->price;
            $totalPrice = $unitPrice * $quantity;
            $subtotal += $totalPrice;

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'product_name' => $product->name,
                'product_sku' => $product->sku,
                'product_price' => $product->price,
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'total_price' => $totalPrice,
            ]);
        }

        // Calculate totals
        $taxAmount = $subtotal * 0.08; // 8% tax
        $discountAmount = 0;
        $couponCode = null;
        $couponDiscount = 0;
        
        // Apply coupon if selected
        if ($selectedCoupon) {
            $couponCode = $selectedCoupon->code;
            if ($selectedCoupon->type === 'percentage') {
                $couponDiscount = ($subtotal * $selectedCoupon->discount_amount) / 100;
                if ($selectedCoupon->maximum_spend && $couponDiscount > $selectedCoupon->maximum_spend) {
                    $couponDiscount = $selectedCoupon->maximum_spend;
                }
            } else {
                $couponDiscount = $selectedCoupon->discount_amount;
            }
            $discountAmount = $couponDiscount;
        } else {
            // Random discount for non-coupon orders
            $discountAmount = rand(0, 1) ? rand(5, 20) : 0;
        }
        
        $totalAmount = $subtotal + $taxAmount + $order->shipping_amount - $discountAmount;

        $order->update([
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'discount_amount' => $discountAmount,
            'total_amount' => $totalAmount,
            'coupon_code' => $couponCode,
            'coupon_discount' => $couponDiscount,
        ]);
    }

    private function getRandomStatus(): string
    {
        $statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        return $statuses[array_rand($statuses)];
    }

    private function getRandomPaymentStatus(): string
    {
        $statuses = ['pending', 'paid', 'failed', 'refunded'];
        return $statuses[array_rand($statuses)];
    }

    private function getRandomPaymentMethod(): string
    {
        $methods = ['credit_card', 'debit_card', 'paypal', 'bank_transfer'];
        return $methods[array_rand($methods)];
    }
}