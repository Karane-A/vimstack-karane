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
        Schema::table('stores', function (Blueprint $table) {
            $table->string('custom_domain')->nullable()->after('domain');
            $table->string('custom_subdomain')->nullable()->after('custom_domain');
            $table->boolean('enable_custom_domain')->default(false)->after('custom_subdomain');
            $table->boolean('enable_custom_subdomain')->default(false)->after('enable_custom_domain');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropColumn(['custom_domain', 'custom_subdomain', 'enable_custom_domain', 'enable_custom_subdomain']);
        });
    }
};