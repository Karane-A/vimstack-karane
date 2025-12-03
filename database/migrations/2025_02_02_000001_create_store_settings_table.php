<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('store_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->onDelete('cascade');
            $table->string('theme')->default('default');
            $table->json('content');
            $table->timestamps();
            
            $table->unique(['store_id', 'theme']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('store_settings');
    }
};