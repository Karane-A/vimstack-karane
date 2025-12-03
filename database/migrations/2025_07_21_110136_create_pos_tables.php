<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // POS Settings Table
        if (!Schema::hasTable('pos_settings')) {
            Schema::create('pos_settings', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('store_id');
                $table->string('currency')->default('usd');
                $table->decimal('tax_rate', 5, 2)->default(10.00);
                $table->decimal('default_discount', 5, 2)->default(0);
                $table->boolean('enable_guest_checkout')->default(true);
                $table->boolean('low_stock_alerts')->default(true);
                $table->boolean('auto_sync_online_orders')->default(false);
                
                // Receipt settings
                $table->text('receipt_header')->nullable();
                $table->text('receipt_footer')->nullable();
                $table->boolean('show_logo_on_receipt')->default(true);
                $table->boolean('show_tax_details')->default(true);
                $table->boolean('show_cashier_name')->default(true);
                $table->boolean('email_receipt')->default(true);
                
                // Hardware settings
                $table->string('receipt_printer')->default('thermal');
                $table->string('barcode_scanner')->default('usb');
                $table->string('cash_drawer')->default('manual');
                $table->string('card_reader')->default('integrated');
                $table->boolean('auto_open_cash_drawer')->default(true);
                $table->boolean('auto_print_receipt')->default(true);
                
                $table->timestamps();
                
                $table->foreign('store_id')->references('id')->on('stores')->onDelete('cascade');
            });
        }
        
        // POS Transactions Table
        if (!Schema::hasTable('pos_transactions')) {
            Schema::create('pos_transactions', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('store_id');
                $table->string('transaction_number');
                $table->unsignedBigInteger('customer_id')->nullable();
                $table->unsignedBigInteger('cashier_id');
                $table->decimal('subtotal', 10, 2)->default(0);
                $table->decimal('tax', 10, 2)->default(0);
                $table->decimal('discount', 10, 2)->default(0);
                $table->decimal('total', 10, 2)->default(0);
                $table->string('status')->default('completed'); // completed, refunded, partial_refund
                $table->text('notes')->nullable();
                $table->timestamps();
                
                $table->foreign('store_id')->references('id')->on('stores')->onDelete('cascade');
                $table->foreign('customer_id')->references('id')->on('customers')->onDelete('set null');
                $table->foreign('cashier_id')->references('id')->on('users')->onDelete('cascade');
            });
        }
        
        // POS Transaction Items Table
        if (!Schema::hasTable('pos_transaction_items')) {
            Schema::create('pos_transaction_items', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('transaction_id');
                $table->unsignedBigInteger('product_id');
                $table->string('product_name');
                $table->string('variant_name')->nullable();
                $table->integer('quantity');
                $table->decimal('price', 10, 2);
                $table->decimal('tax', 10, 2)->default(0);
                $table->decimal('discount', 10, 2)->default(0);
                $table->decimal('total', 10, 2);
                $table->timestamps();
                
                $table->foreign('transaction_id')->references('id')->on('pos_transactions')->onDelete('cascade');
                $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            });
        }
        
        // POS Payments Table
        if (!Schema::hasTable('pos_payments')) {
            Schema::create('pos_payments', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('transaction_id');
                $table->string('payment_method'); // card, cash, paypal, etc.
                $table->decimal('amount', 10, 2);
                $table->decimal('change_amount', 10, 2)->default(0); // For cash payments
                $table->string('reference_number')->nullable(); // For card payments
                $table->string('status')->default('completed');
                $table->timestamps();
                
                $table->foreign('transaction_id')->references('id')->on('pos_transactions')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pos_payments');
        Schema::dropIfExists('pos_transaction_items');
        Schema::dropIfExists('pos_transactions');
        Schema::dropIfExists('pos_settings');
    }
};