<?php

use App\Models\Order;
use Illuminate\Support\Facades\Broadcast;

/**
 * Autorise l'accès au canal privé d'une commande :
 * le client propriétaire, le coursier assigné, ou un admin.
 */
Broadcast::channel('orders.{orderId}', function ($user, $orderId) {
    $order = Order::find($orderId);

    if (! $order) {
        return false;
    }

    return $order->user_id === $user->id
        || $order->courier_id === $user->id
        || $user->isAdmin();
});
