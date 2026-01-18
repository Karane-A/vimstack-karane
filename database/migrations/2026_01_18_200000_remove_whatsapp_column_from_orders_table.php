<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('orders', 'whatsapp_number')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->dropColumn('whatsapp_number');
            });
        }
    }

    public function down(): void
    {
        if (!Schema::hasColumn('orders', 'whatsapp_number')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->string('whatsapp_number')->nullable()->after('customer_phone');
            });
        }
    }
};
