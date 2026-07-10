<?php

namespace App\Http\Controllers;

use App\Models\Restaurant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RestaurantController extends Controller
{
    public function index(Request $request)
    {
        $restaurants = Restaurant::query()
            ->active()
            ->when($request->string('category')->isNotEmpty(), fn ($q) => $q->where('category', $request->input('category')))
            ->when($request->string('search')->isNotEmpty(), fn ($q) => $q->where('name', 'like', '%'.$request->input('search').'%'))
            ->orderByDesc('rating')
            ->get();

        return Inertia::render('Restaurants/Index', [
            'restaurants' => $restaurants,
            'filters' => $request->only(['category', 'search']),
        ]);
    }

    public function show(Restaurant $restaurant)
    {
        $this->authorize('view', $restaurant);

        $restaurant->load(['menuItems', 'dailyMenus.menuItem']);

        return Inertia::render('Restaurants/Show', [
            'restaurant' => $restaurant,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Restaurant::class);

        $data = $request->validate([
            'slug' => 'required|string|unique:restaurants,slug',
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'image' => 'nullable|string',
            'delivery_time' => 'nullable|string',
            'delivery_fee' => 'nullable|integer|min:0',
            'district' => 'nullable|string',
            'tags' => 'nullable|array',
        ]);

        $restaurant = Restaurant::create($data);

        return redirect()->route('restaurants.show', $restaurant)->with('success', 'Restaurant créé.');
    }

    public function update(Request $request, Restaurant $restaurant)
    {
        $this->authorize('update', $restaurant);

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'category' => 'sometimes|string|max:255',
            'image' => 'nullable|string',
            'delivery_time' => 'nullable|string',
            'delivery_fee' => 'nullable|integer|min:0',
            'district' => 'nullable|string',
            'tags' => 'nullable|array',
            'is_active' => 'sometimes|boolean',
        ]);

        $restaurant->update($data);

        return back()->with('success', 'Restaurant mis à jour.');
    }

    public function destroy(Restaurant $restaurant)
    {
        $this->authorize('delete', $restaurant);

        $restaurant->delete();

        return redirect()->route('restaurants.index')->with('success', 'Restaurant supprimé.');
    }
}
