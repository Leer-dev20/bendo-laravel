<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('restaurant_slug');
            $table->string('restaurant_name');
            $table->string('customer_name');
            $table->string('phone');
            $table->string('address');
            $table->text('notes')->nullable();
            $table->json('items'); // snapshot des articles commandés
            $table->integer('subtotal');
            $table->integer('delivery_fee');
            $table->integer('platform_fee');
            $table->integer('total');
            $table->enum('payment_method', ['cash', 'card', 'wallet', 'wave', 'orange_money'])->default('cash');
            $table->string('payment_status')->default('pending');
            $table->enum('status', [
                'pending_payment', 'confirmed', 'preparing', 'ready',
                'picked_up', 'delivered', 'cancelled',
            ])->default('confirmed');
            $table->foreignId('courier_id')->nullable()->constrained('users')->nullOnDelete();
            $table->integer('prep_minutes')->default(25);
            $table->timestamp('estimated_ready_at')->nullable();
            $table->timestamp('estimated_delivery_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('courier_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
