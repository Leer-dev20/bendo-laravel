<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DailyMenu;
use Illuminate\Http\Request;

class DailyMenuController extends Controller
{
   public function toggle(Request $request)
{
    $data = $request->validate([
        'menu_item_id' => 'required|exists:menu_items,id',
        'restaurant_id' => 'required|exists:restaurants,id',
        'on' => 'required|boolean',
    ]);

    $today = now()->toDateString();

    $query = DailyMenu::where('menu_item_id', $data['menu_item_id'])
        ->where('restaurant_id', $data['restaurant_id'])
        ->whereDate('menu_date', $today);

    if ($data['on']) {
        if (! $query->exists()) {
            DailyMenu::create([
                'menu_item_id' => $data['menu_item_id'],
                'restaurant_id' => $data['restaurant_id'],
                'menu_date' => $today,
            ]);
        }
    } else {
        $query->delete();
    }

    return back();
}
}
