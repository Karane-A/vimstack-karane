<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update all currencies to set is_default to false
        DB::table('currencies')->update(['is_default' => false]);
        
        // Set UGX as default currency
        DB::table('currencies')
            ->where('code', 'UGX')
            ->update(['is_default' => true]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert UGX to not default
        DB::table('currencies')
            ->where('code', 'UGX')
            ->update(['is_default' => false]);
        
        // Set USD back as default
        DB::table('currencies')
            ->where('code', 'USD')
            ->update(['is_default' => true]);
    }
};
