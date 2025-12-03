<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('landing_page_settings', function (Blueprint $table) {
            $table->id();
            $table->string('company_name')->nullable()->default('StoreGo');
            $table->string('contact_email')->nullable()->default('support@storego.com');
            $table->string('contact_phone')->nullable()->default('+1 (555) 123-4567');
            $table->string('contact_address')->nullable()->default('San Francisco, CA');
            $table->json('config_sections')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('landing_page_settings');
    }
};