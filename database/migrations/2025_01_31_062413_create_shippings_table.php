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
        Schema::create('shippings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('store_id');
            $table->string('name');
            $table->string('type'); // flat_rate, free_shipping, weight_based, distance_based, percentage_based
            $table->text('description')->nullable();
            $table->decimal('cost', 10, 2)->default(0.00);
            $table->decimal('min_order_amount', 10, 2)->default(0.00);
            $table->string('delivery_time')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->string('zone_type')->nullable(); // domestic, international, local, regional
            $table->text('countries')->nullable();
            $table->string('postal_codes')->nullable();
            $table->decimal('max_distance', 10, 2)->nullable();
            $table->decimal('max_weight', 10, 2)->nullable();
            $table->string('max_dimensions')->nullable();
            $table->boolean('require_signature')->default(false);
            $table->boolean('insurance_required')->default(false);
            $table->boolean('tracking_available')->default(true);
            $table->decimal('handling_fee', 10, 2)->default(0.00);
            $table->integer('views')->default(0);
            $table->timestamps();
            
            $table->foreign('store_id')->references('id')->on('stores')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shippings');
    }
};