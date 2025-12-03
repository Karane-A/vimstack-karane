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
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name',100)->unique();
            $table->float('price',30, 2)->default(0); // Monthly price
            $table->float('yearly_price',30, 2)->nullable(); // Yearly price
            $table->string('duration',100);
            $table->text('themes')->nullable();
            $table->integer('business')->default(0);
            $table->integer('max_users')->default(0);
            $table->text('description')->nullable();
            $table->string('enable_custdomain')->default('off');
            $table->string('enable_custsubdomain')->default('off');
            $table->string('enable_branding',255)->default('on');
            $table->string('pwa_business')->default('off');
            $table->string('enable_chatgpt',255)->default('on');
            $table->float('storage_limit',15, 2)->default('0.00');
            $table->string('is_trial')->nullable();
            $table->integer('trial_day')->default(0);
            $table->string('is_plan_enable')->default('on');
            $table->boolean('is_default')->default(false);
            $table->text('module')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};