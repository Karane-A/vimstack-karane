<?php

namespace Database\Seeders;

use App\Models\POSTransaction;
use App\Models\POSTransactionItem;
use App\Models\Store;
use App\Models\Customer;
use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class POSTransactionSeeder extends Seeder
{
    public function run(): void
    {
        // Get stores only for the first company (company@example.com)
        $firstCompany = User::where('email', 'company@example.com')->first();
        if (!$firstCompany) {
            $this->command->error('First company not found.');
            return;
        }
        
        $stores = Store::where('user_id', $firstCompany->id)->get();
        $customers = Customer::all();
        $cashier = User::first();

        if ($stores->isEmpty() || !$cashier) {
            $this->command->error('Required data not found. Please run StoreSeeder and UserSeeder first.');
            return;
        }

        foreach ($stores as $store) {
            // Skip stores without products
            if (Product::where('store_id', $store->id)->count() === 0) {
                continue;
            }
            
            $transactions = [
                [
                    'store_id' => $store->id,
                    'customer_id' => $customers->isNotEmpty() ? $customers->random()->id : null,
                    'cashier_id' => $cashier->id,
                    'subtotal' => 89.50,
                    'tax' => 7.16,
                    'discount' => 5.00,
                    'total' => 91.66,
                    'status' => 'completed',
                    'notes' => 'Customer paid with credit card'
                ],
                [
                    'store_id' => $store->id,
                    'customer_id' => $customers->isNotEmpty() ? $customers->random()->id : null,
                    'cashier_id' => $cashier->id,
                    'subtotal' => 156.75,
                    'tax' => 12.54,
                    'discount' => 15.00,
                    'total' => 154.29,
                    'status' => 'completed',
                    'notes' => 'Applied loyalty discount'
                ],
                [
                    'store_id' => $store->id,
                    'customer_id' => $customers->isNotEmpty() ? $customers->random()->id : null,
                    'cashier_id' => $cashier->id,
                    'subtotal' => 45.25,
                    'tax' => 3.62,
                    'discount' => 0.00,
                    'total' => 48.87,
                    'status' => 'completed',
                    'notes' => 'Cash payment'
                ],
                [
                    'store_id' => $store->id,
                    'customer_id' => null,
                    'cashier_id' => $cashier->id,
                    'subtotal' => 23.99,
                    'tax' => 1.92,
                    'discount' => 0.00,
                    'total' => 25.91,
                    'status' => 'completed',
                    'notes' => 'Walk-in customer'
                ],
                [
                    'store_id' => $store->id,
                    'customer_id' => $customers->isNotEmpty() ? $customers->random()->id : null,
                    'cashier_id' => $cashier->id,
                    'subtotal' => 299.99,
                    'tax' => 24.00,
                    'discount' => 30.00,
                    'total' => 293.99,
                    'status' => 'completed',
                    'notes' => 'Bulk purchase discount applied'
                ],
                [
                    'store_id' => $store->id,
                    'customer_id' => $customers->isNotEmpty() ? $customers->random()->id : null,
                    'cashier_id' => $cashier->id,
                    'subtotal' => 67.80,
                    'tax' => 5.42,
                    'discount' => 10.00,
                    'total' => 63.22,
                    'status' => 'refunded',
                    'notes' => 'Product return - full refund'
                ],
                [
                    'store_id' => $store->id,
                    'customer_id' => $customers->isNotEmpty() ? $customers->random()->id : null,
                    'cashier_id' => $cashier->id,
                    'subtotal' => 134.50,
                    'tax' => 10.76,
                    'discount' => 0.00,
                    'total' => 145.26,
                    'status' => 'pending',
                    'notes' => 'Payment processing'
                ]
            ];

            foreach ($transactions as $index => $transactionData) {
                $daysAgo = $index + rand(1, 15);
                $createdAt = Carbon::now()->subDays($daysAgo);
                
                $transactionData['transaction_number'] = $this->generateTransactionNumber();
                $transactionData['created_at'] = $createdAt;
                $transactionData['updated_at'] = $createdAt;

                $transaction = POSTransaction::create($transactionData);
                
                // Create transaction items for each transaction
                $this->createTransactionItems($transaction, $store->id);
            }
        }

    }

    private function generateTransactionNumber()
    {
        $year = now()->year;

        $lastTransaction = POSTransaction::whereYear('created_at', $year)
            ->orderBy('id', 'desc')
            ->first();

        $lastNumber = 0;

        if ($lastTransaction && preg_match('/POS-' . $year . '-(\d+)/', $lastTransaction->transaction_number, $matches)) {
            $lastNumber = (int) $matches[1];
        }

        $newNumber = $lastNumber + 1;

        return 'POS-' . $year . '-' . str_pad($newNumber, 3, '0', STR_PAD_LEFT);
    }
    
    private function createTransactionItems($transaction, $storeId)
    {
        $products = Product::where('store_id', $storeId)->take(rand(1, 4))->get();
        
        if ($products->isEmpty()) {
            return;
        }
        
        foreach ($products as $product) {
            $quantity = rand(1, 3);
            $price = $product->price;
            $total = $price * $quantity;
            
            POSTransactionItem::create([
                'transaction_id' => $transaction->id,
                'product_id' => $product->id,
                'product_name' => $product->name,
                'variant_name' => null,
                'quantity' => $quantity,
                'price' => $price,
                'tax' => $total * 0.08, // 8% tax
                'discount' => 0,
                'total' => $total
            ]);
        }
    }
}
