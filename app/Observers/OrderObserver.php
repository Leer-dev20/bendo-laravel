<?php

namespace App\Observers;

use App\Models\Order;
use App\Models\OrderStatusHistory;
use Illuminate\Support\Facades\Auth;

class OrderObserver
{
    /**
     * Avant insertion : calcule les ETA si absentes
     * (équivalent trigger on_order_status_change BEFORE INSERT).
     */
    public function creating(Order $order): void
    {
        if (! $order->estimated_ready_at) {
            $order->estimated_ready_at = now()->addMinutes($order->prep_minutes ?? 25);
        }
        if (! $order->estimated_delivery_at) {
            $order->estimated_delivery_at = $order->estimated_ready_at->clone()->addMinutes(15);
        }
    }

    /**
     * Avant mise à jour : si passage à 'delivered', fixe delivered_at
     * (équivalent trigger on_order_status_change BEFORE UPDATE).
     */
    public function updating(Order $order): void
    {
        if ($order->isDirty('status') && $order->status === 'delivered' && ! $order->delivered_at) {
            $order->delivered_at = now();
        }
    }

    /**
     * Après création : log dans l'historique
     * (équivalent trigger orders_history AFTER INSERT).
     */
    public function created(Order $order): void
    {
        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => $order->status,
            'changed_by' => $order->user_id,
        ]);
    }

    /**
     * Après mise à jour : log le changement de statut si différent
     * (équivalent trigger orders_history AFTER UPDATE).
     */
    public function updated(Order $order): void
    {
        if ($order->wasChanged('status')) {
            OrderStatusHistory::create([
                'order_id' => $order->id,
                'status' => $order->status,
                'changed_by' => Auth::id(),
            ]);
        }
    }
}
