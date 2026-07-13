<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('zone_rates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('from_zone_id')->constrained('zones')->cascadeOnDelete();
            $table->foreignId('to_zone_id')->constrained('zones')->cascadeOnDelete();
            $table->integer('price');
            $table->timestamps();

            $table->unique(['from_zone_id', 'to_zone_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('zone_rates');
    }
};
