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
            $table->boolean('enable_pwa')->default(false)->after('is_active');
            $table->string('pwa_name')->nullable()->after('enable_pwa');
            $table->string('pwa_short_name', 12)->nullable()->after('pwa_name');
            $table->text('pwa_description')->nullable()->after('pwa_short_name');
            $table->string('pwa_theme_color', 7)->default('#3B82F6')->after('pwa_description');
            $table->string('pwa_background_color', 7)->default('#ffffff')->after('pwa_theme_color');
            $table->string('pwa_icon')->nullable()->after('pwa_background_color');
            $table->enum('pwa_display', ['standalone', 'fullscreen', 'minimal-ui', 'browser'])->default('standalone')->after('pwa_icon');
            $table->enum('pwa_orientation', ['portrait', 'landscape', 'any'])->default('portrait')->after('pwa_display');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropColumn([
                'enable_pwa',
                'pwa_name',
                'pwa_short_name',
                'pwa_description',
                'pwa_theme_color',
                'pwa_background_color',
                'pwa_icon',
                'pwa_display',
                'pwa_orientation'
            ]);
        });
    }
};
