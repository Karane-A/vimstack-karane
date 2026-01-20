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
        Schema::create('tickets', function (Blueprint $ticket) {
            $ticket->id();
            $ticket->string('ticket_number')->unique();
            $ticket->unsignedBigInteger('user_id');
            $ticket->string('subject');
            $ticket->string('category')->default('general');
            $ticket->string('priority')->default('medium');
            $ticket->string('status')->default('open');
            $ticket->timestamps();

            $ticket->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
