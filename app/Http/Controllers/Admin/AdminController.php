<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DailyMenu;
use App\Models\MenuItem;
use App\Models\Restaurant;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        $today = now()->toDateString();

        return Inertia::render('Admin', [
            'restaurants' => Restaurant::withCount('menuItems')->orderByDesc('created_at')->get(),
            'menuItems' => MenuItem::orderByDesc('created_at')->get(),
            'dailyToday' => DailyMenu::where('menu_date', $today)->get(['menu_item_id', 'restaurant_id']),
            'today' => $today,
        ]);
    }
}
