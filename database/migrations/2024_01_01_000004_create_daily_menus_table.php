<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_menus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('restaurant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('menu_item_id')->constrained()->cascadeOnDelete();
            $table->date('menu_date')->default(now()->toDateString());
            $table->timestamps();

            $table->unique(['restaurant_id', 'menu_item_id', 'menu_date'], 'daily_menus_unique');
            $table->index(['restaurant_id', 'menu_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_menus');
    }
};
