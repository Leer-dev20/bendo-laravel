<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courier_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('from_zone_id')->constrained('zones');
            $table->foreignId('to_zone_id')->constrained('zones');
            $table->string('pickup_address');
            $table->string('dropoff_address');
            $table->string('recipient_name');
            $table->string('recipient_phone');
            $table->string('package_description')->nullable();
            $table->integer('price');
            $table->enum('payment_method', ['cash', 'card', 'wallet', 'wave', 'orange_money'])->default('cash');
            $table->string('payment_status')->default('pending');
            $table->enum('status', [
                'pending_payment', 'searching', 'assigned', 'picked_up', 'delivered', 'cancelled',
            ])->default('pending_payment');
            $table->foreignId('courier_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('assigned_at')->nullable();
            $table->timestamp('picked_up_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('courier_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courier_requests');
    }
};
