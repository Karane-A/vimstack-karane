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
        Schema::table('plans', function (Blueprint $table) {
            // Rename business to max_stores
            $table->renameColumn('business', 'max_stores');
            
            // Rename max_users to max_users_per_store
            $table->renameColumn('max_users', 'max_users_per_store');
            
            // Add max_products_per_store
            $table->integer('max_products_per_store')->default(0)->after('max_users_per_store');
            
            // Add new feature flags
            $table->string('enable_custom_pages')->default('off')->after('enable_chatgpt');
            $table->string('enable_blog')->default('off')->after('enable_custom_pages');
            $table->string('enable_shipping_method')->default('off')->after('enable_blog');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            // Reverse the changes
            $table->renameColumn('max_stores', 'business');
            $table->renameColumn('max_users_per_store', 'max_users');
            $table->dropColumn('max_products_per_store');
            $table->dropColumn('enable_custom_pages');
            $table->dropColumn('enable_blog');
            $table->dropColumn('enable_shipping_method');
        });
    }
};