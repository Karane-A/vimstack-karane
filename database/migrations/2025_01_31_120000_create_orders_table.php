<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->unsignedBigInteger('store_id');
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->string('session_id')->nullable();
            
            // Order status
            $table->enum('status', ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])->default('pending');
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'])->default('pending');
            
            // Customer info
            $table->string('customer_email');
            $table->string('customer_phone')->nullable();
            $table->string('customer_first_name');
            $table->string('customer_last_name');
            
            // Shipping address
            $table->string('shipping_address');
            $table->string('shipping_city');
            $table->string('shipping_state');
            $table->string('shipping_postal_code');
            $table->string('shipping_country');
            
            // Billing address
            $table->string('billing_address');
            $table->string('billing_city');
            $table->string('billing_state');
            $table->string('billing_postal_code');
            $table->string('billing_country');
            
            // Pricing
            $table->decimal('subtotal', 10, 2);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('shipping_amount', 10, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2);
            
            // Payment info
            $table->string('payment_method');
            $table->string('payment_gateway')->nullable();
            $table->string('payment_transaction_id')->nullable();
            $table->json('payment_details')->nullable();
            
            // Shipping info
            $table->unsignedBigInteger('shipping_method_id')->nullable();
            $table->string('tracking_number')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            
            // Additional info
            $table->text('notes')->nullable();
            $table->string('coupon_code')->nullable();
            $table->decimal('coupon_discount', 10, 2)->default(0);
            
            $table->timestamps();
            
            $table->foreign('store_id')->references('id')->on('stores')->onDelete('cascade');
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('set null');
            $table->foreign('shipping_method_id')->references('id')->on('shippings')->onDelete('set null');
            
            $table->index(['store_id', 'status']);
            $table->index(['customer_id']);
            $table->index(['order_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};