<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('courier_requests', function (Blueprint $table) {
            $table->timestamp('estimated_pickup_at')->nullable()->after('price');
            $table->timestamp('estimated_delivery_at')->nullable()->after('estimated_pickup_at');
        });
    }

    public function down(): void
    {
        Schema::table('courier_requests', function (Blueprint $table) {
            $table->dropColumn(['estimated_pickup_at', 'estimated_delivery_at']);
        });
    }
};
