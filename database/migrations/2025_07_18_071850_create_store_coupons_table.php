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
        Schema::create('store_coupons', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->string('code_type')->default('manual'); // manual or auto
            $table->enum('type', ['percentage', 'flat'])->default('percentage');
            $table->decimal('discount_amount', 10, 2);
            $table->decimal('minimum_spend', 10, 2)->nullable();
            $table->decimal('maximum_spend', 10, 2)->nullable();
            $table->integer('use_limit_per_coupon')->nullable(); // null means unlimited
            $table->integer('use_limit_per_user')->nullable(); // null means unlimited
            $table->integer('used_count')->default(0);
            $table->date('start_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->boolean('status')->default(true);
            $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_coupons');
    }
};
