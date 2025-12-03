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
        Schema::create('taxes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('rate', 8, 2);
            $table->enum('type', ['percentage', 'fixed'])->default('percentage');
            $table->string('region')->nullable();
            $table->integer('priority')->default(1);
            $table->boolean('compound')->default(false);
            $table->boolean('is_active')->default(true);
            $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
            $table->timestamps();
            
            // Composite index for store-specific taxes
            $table->unique(['name', 'store_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('taxes');
    }
};
