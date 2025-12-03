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
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['percentage', 'flat']);
            $table->decimal('minimum_spend', 10, 2)->nullable();
            $table->decimal('maximum_spend', 10, 2)->nullable();
            $table->decimal('discount_amount', 10, 2);
            $table->integer('use_limit_per_coupon')->nullable();
            $table->integer('use_limit_per_user')->nullable();
            $table->date('expiry_date')->nullable();
            $table->string('code')->unique();
            $table->enum('code_type', ['manual', 'auto'])->default('manual');
            $table->boolean('status')->default(true);
            $table->unsignedBigInteger('created_by');
            $table->timestamps();

            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};
