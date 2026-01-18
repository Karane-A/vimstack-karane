<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Add timestamp fields for tracking status changes
            $table->timestamp('confirmed_at')->nullable()->after('delivered_at');
            $table->timestamp('processing_at')->nullable()->after('confirmed_at');
            $table->timestamp('cancelled_at')->nullable()->after('processing_at');
            $table->timestamp('refunded_at')->nullable()->after('cancelled_at');
            $table->timestamp('payment_confirmed_at')->nullable()->after('refunded_at');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'confirmed_at',
                'processing_at',
                'cancelled_at',
                'refunded_at',
                'payment_confirmed_at',
            ]);
        });
    }
};
