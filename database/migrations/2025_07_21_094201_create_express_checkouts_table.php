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
        Schema::create('express_checkouts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('store_id');
            $table->string('name');
            $table->string('type');
            $table->text('description')->nullable();
            $table->string('button_text')->default('Buy Now');
            $table->string('button_color')->default('#000000');
            $table->boolean('is_active')->default(true);
            $table->json('payment_methods')->nullable();
            $table->string('default_payment_method')->nullable();
            $table->boolean('skip_cart')->default(true);
            $table->boolean('auto_fill_customer_data')->default(true);
            $table->boolean('guest_checkout_allowed')->default(false);
            $table->boolean('mobile_optimized')->default(true);
            $table->boolean('save_payment_methods')->default(false);
            $table->string('success_redirect_url')->nullable();
            $table->string('cancel_redirect_url')->nullable();
            $table->integer('conversions')->default(0);
            $table->decimal('revenue', 10, 2)->default(0.00);
            $table->timestamps();
            
            $table->foreign('store_id')->references('id')->on('stores')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('express_checkouts');
    }
};