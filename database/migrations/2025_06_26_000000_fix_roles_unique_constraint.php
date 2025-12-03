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
        Schema::table('roles', function (Blueprint $table) {
            // Drop the incorrect unique constraint on guard_name only
            $table->dropUnique(['guard_name']);
            
            // Add the correct unique constraint on name and guard_name
            $table->unique(['name', 'guard_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('roles', function (Blueprint $table) {
            // Reverse the changes
            $table->dropUnique(['name', 'guard_name']);
            $table->unique(['guard_name']);
        });
    }
};