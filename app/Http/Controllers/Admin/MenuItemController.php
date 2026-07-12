<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'restaurant_id' => 'required|exists:restaurants,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'price' => 'required|integer|min:1|max:10000',
            'image' => 'nullable|string|max:500',
        ]);

        $data['description'] = $data['description'] ?? '';
        $data['image'] = $data['image'] ?? '';

        MenuItem::create($data);

        return back()->with('success', 'Plat ajouté.');
    }

    public function update(Request $request, MenuItem $menuItem)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'price' => 'required|integer|min:1|max:10000',
            'image' => 'nullable|string|max:500',
        ]);

        $data['description'] = $data['description'] ?? '';
        $data['image'] = $data['image'] ?? '';

        $menuItem->update($data);

        return back()->with('success', 'Plat mis à jour.');
    }

    public function destroy(MenuItem $menuItem)
    {
        $menuItem->delete();

        return back()->with('success', 'Plat supprimé.');
    }
}
