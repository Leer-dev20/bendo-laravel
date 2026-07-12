<?php

namespace App\Http\Controllers;

use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class RestaurantController extends Controller
{
   public function index(Request $request)
{
    $restaurants = Restaurant::query()
        ->active()
        ->with('menuItems:id,restaurant_id,name,description,price')
        ->orderByDesc('rating')
        ->get();

    return Inertia::render('Restaurants/Index', [
        'restaurants' => $restaurants,
    ]);
}

 public function show(Restaurant $restaurant)
{
    $this->authorize('view', $restaurant);

    $restaurant->load('menuItems');

    return Inertia::render('Restaurants/Show', [
        'restaurant' => $restaurant,
    ]);
}

public function store(Request $request)
{
    $this->authorize('create', Restaurant::class);

    $data = $request->validate([
        'name' => 'required|string|max:255',
        'category' => 'required|string|max:255',
        'image' => 'nullable|string',
        'delivery_time' => 'nullable|string',
        'delivery_fee' => 'nullable|integer|min:0',
        'district' => 'nullable|string',
        'rating' => 'nullable|numeric|min:0|max:5',
        'tags' => 'nullable|string',
        'is_active' => 'nullable|boolean',
    ]);

    $data['image'] = $data['image'] ?? '';
    $data['district'] = $data['district'] ?? '';
    $data['delivery_time'] = $data['delivery_time'] ?? '25-35 min';

    $data['tags'] = collect(explode(',', $data['tags'] ?? ''))
        ->map(fn ($t) => trim($t))
        ->filter()
        ->take(10)
        ->values()
        ->all();

    $baseSlug = Str::slug($data['name']);
    $slug = $baseSlug;
    $i = 1;
    while (Restaurant::where('slug', $slug)->exists()) {
        $slug = "{$baseSlug}-{$i}";
        $i++;
    }
    $data['slug'] = $slug;

    Restaurant::create($data);

    return back()->with('success', 'Restaurant créé.');
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
        'rating' => 'nullable|numeric|min:0|max:5',
        'tags' => 'nullable|string',
        'is_active' => 'nullable|boolean',
    ]);

    $data['image'] = $data['image'] ?? '';
    $data['district'] = $data['district'] ?? '';
    $data['delivery_time'] = $data['delivery_time'] ?? '25-35 min';

    if (isset($data['tags'])) {
        $data['tags'] = collect(explode(',', $data['tags']))
            ->map(fn ($t) => trim($t))
            ->filter()
            ->take(10)
            ->values()
            ->all();
    }

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
