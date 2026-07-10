<?php

namespace Database\Seeders;

use App\Models\MenuItem;
use App\Models\Restaurant;
use Illuminate\Database\Seeder;

class RestaurantSeeder extends Seeder
{
    public function run(): void
    {
        $senegalDishes = [
            ['name' => 'Thieboudienne', 'description' => 'Riz rouge au poisson, légumes mijotés et sauce traditionnelle.', 'price' => 65, 'image' => '/images/dishes/dish-thieb.jpg'],
            ['name' => 'Poulet Yassa', 'description' => 'Poulet mariné, oignons confits au citron, riz blanc.', 'price' => 55, 'image' => '/images/dishes/dish-yassa.jpg'],
            ['name' => 'Mafé Boeuf', 'description' => "Ragoût de boeuf à la sauce d'arachide, riz blanc.", 'price' => 60, 'image' => '/images/dishes/dish-mafe.jpg'],
        ];

        $moroccanDishes = [
            ['name' => 'Tajine poulet citron-olives', 'description' => 'Poulet fermier mijoté au citron confit, olives vertes et safran.', 'price' => 70, 'image' => '/images/dishes/dish-tajine.jpg'],
            ['name' => 'Couscous royal', 'description' => 'Semoule fine, agneau, poulet, merguez et 7 légumes.', 'price' => 85, 'image' => '/images/dishes/dish-couscous.jpg'],
            ['name' => 'Pastilla au poulet', 'description' => 'Feuilleté croustillant au poulet, amandes, cannelle et sucre glace.', 'price' => 75, 'image' => '/images/dishes/dish-pastilla.jpg'],
            ['name' => 'Harira maison', 'description' => 'Soupe traditionnelle tomate, lentilles, pois chiches et coriandre.', 'price' => 25, 'image' => '/images/dishes/dish-harira.jpg'],
        ];

        $restaurants = [
            [
                'slug' => 'teranga', 'name' => 'Chez Téranga', 'category' => 'Sénégalais',
                'image' => '/images/restaurants/resto-1.jpg', 'rating' => 4.8,
                'delivery_time' => '25-35 min', 'delivery_fee' => 15, 'district' => 'Maârif',
                'tags' => ['Halal', 'Maison', 'Populaire'], 'dishes' => $senegalDishes,
            ],
            [
                'slug' => 'dakar-house', 'name' => 'Dakar House', 'category' => 'Sénégalais',
                'image' => '/images/restaurants/resto-2.jpg', 'rating' => 4.6,
                'delivery_time' => '30-40 min', 'delivery_fee' => 18, 'district' => 'Gauthier',
                'tags' => ['Halal', 'Famille'], 'dishes' => $senegalDishes,
            ],
            [
                'slug' => 'baobab-grill', 'name' => 'Baobab Grill', 'category' => 'Sénégalais',
                'image' => '/images/restaurants/resto-3.jpg', 'rating' => 4.7,
                'delivery_time' => '20-30 min', 'delivery_fee' => 12, 'district' => 'Bourgogne',
                'tags' => ['Grillades', 'Street food'], 'dishes' => $senegalDishes,
            ],
            [
                'slug' => 'dar-tajine', 'name' => 'Dar Tajine', 'category' => 'Marocain',
                'image' => '/images/restaurants/resto-maroc-1.jpg', 'rating' => 4.9,
                'delivery_time' => '30-45 min', 'delivery_fee' => 15, 'district' => 'Habous, Casablanca',
                'tags' => ['Halal', 'Traditionnel', 'Maison'], 'dishes' => $moroccanDishes,
            ],
            [
                'slug' => 'atlas-grill', 'name' => 'Atlas Grill', 'category' => 'Marocain',
                'image' => '/images/restaurants/resto-maroc-2.jpg', 'rating' => 4.7,
                'delivery_time' => '25-35 min', 'delivery_fee' => 18, 'district' => 'Maârif, Casablanca',
                'tags' => ['Halal', 'Grillades', 'Familial'], 'dishes' => $moroccanDishes,
            ],
            [
                'slug' => 'riad-andaloussia', 'name' => 'Riad Andaloussia', 'category' => 'Marocain',
                'image' => '/images/restaurants/resto-maroc-3.jpg', 'rating' => 4.8,
                'delivery_time' => '35-50 min', 'delivery_fee' => 20, 'district' => 'Agdal, Rabat',
                'tags' => ['Halal', 'Raffiné', 'Spécialités'], 'dishes' => $moroccanDishes,
            ],
        ];

        foreach ($restaurants as $data) {
            $dishes = $data['dishes'];
            unset($data['dishes']);

            $restaurant = Restaurant::updateOrCreate(['slug' => $data['slug']], $data);

            foreach ($dishes as $dish) {
                MenuItem::updateOrCreate(
                    ['restaurant_id' => $restaurant->id, 'name' => $dish['name']],
                    $dish,
                );
            }
        }
    }
}
