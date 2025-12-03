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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->nullable();
            $table->rememberToken();
            $table->string('lang')->default('en')->nullable();
            $table->unsignedBigInteger('current_store')->nullable();
            $table->string('avatar')->nullable();
            $table->string('type', 20)->default('company');
            $table->unsignedBigInteger('plan_id')->nullable();
            $table->date('plan_expire_date')->nullable();
            $table->integer('requested_plan')->default(0);
            $table->integer('created_by')->default(0);
            $table->string('mode')->default('light');
            $table->integer('plan_is_active')->default(1);
            $table->float('storage_limit', 15, 2)->default(0.00);
            $table->integer('is_enable_login')->default(1);
            $table->integer('google2fa_enable')->default(0);
            $table->text('google2fa_secret')->nullable();
            $table->string('status')->default('active');
            $table->string('is_trial')->nullable();
            $table->integer('trial_day')->default(0);
            $table->date('trial_expire_date')->nullable();
            $table->text('active_module')->nullable();
            $table->integer('referral_code')->default(0);
            $table->integer('used_referral_code')->default(0);
            $table->integer('commission_amount')->default(0);
            $table->timestamps();

            // Foreign keys will be added in a separate migration after all tables are created
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

        if (Schema::hasColumn('users', 'referral_code')){
            $users = DB::table('users')->where('type','company')->get();
            foreach ($users as $user) {
                do {
                    $code = rand(100000, 999999);
                } while (DB::table('users')->where('referral_code', $code)->exists());
                DB::table('users')->where('id', $user->id)->update(['referral_code' => $code]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
