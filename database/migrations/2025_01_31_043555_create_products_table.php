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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('sku')->nullable();
            $table->text('description')->nullable();
            $table->text('specifications')->nullable();
            $table->text('details')->nullable();
            $table->decimal('price', 10, 2)->default(0);
            $table->decimal('sale_price', 10, 2)->nullable();
            $table->integer('stock')->default(0);
            $table->string('cover_image')->nullable();
            $table->text('images')->nullable(); // Stores comma-separated image paths
            $table->text('variants')->nullable(); // Stores JSON encoded variants
            $table->text('custom_fields')->nullable(); // Stores JSON encoded custom fields
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null');
            $table->foreignId('tax_id')->nullable()->constrained('taxes')->onDelete('set null');
            $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
            $table->boolean('is_active')->default(true);
            $table->boolean('is_downloadable')->default(false);
            $table->string('downloadable_file')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
