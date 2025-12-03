<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->foreignId('store_id')->constrained()->onDelete('cascade');
            $table->integer('rating')->unsigned()->comment('1-5 star rating');
            $table->string('title');
            $table->text('content');
            $table->boolean('is_approved')->default(true);
            $table->timestamps();
            
            $table->index(['product_id', 'is_approved']);
            $table->unique(['product_id', 'customer_id'], 'unique_customer_product_review');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_reviews');
    }
};