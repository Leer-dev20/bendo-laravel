<?php

namespace App\Policies;

use App\Models\Restaurant;
use App\Models\User;

class RestaurantPolicy
{
    /** Public : tout le monde voit les restaurants actifs, l'admin voit tout. */
    public function view(?User $user, Restaurant $restaurant): bool
    {
        return $restaurant->is_active || ($user && $user->isAdmin());
    }

    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Restaurant $restaurant): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Restaurant $restaurant): bool
    {
        return $user->isAdmin();
    }
}
