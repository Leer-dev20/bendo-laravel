<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    /**
     * Voit sa propre commande, OU admin, OU coursier assigné /
     * commande en 'ready'/'preparing' (peut la prendre en charge).
     */
    public function view(User $user, Order $order): bool
    {
        if ($order->user_id === $user->id || $user->isAdmin()) {
            return true;
        }

        return $user->isCourier()
            && ($order->courier_id === $user->id || in_array($order->status, ['ready', 'preparing']));
    }

    public function create(User $user): bool
    {
        return true; // tout utilisateur connecté peut créer sa commande
    }

    /**
     * Le coursier ne peut mettre à jour que les commandes non assignées
     * ou déjà assignées à lui-même.
     */
    public function update(User $user, Order $order): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->isCourier() && ($order->courier_id === $user->id || $order->courier_id === null);
    }
}
