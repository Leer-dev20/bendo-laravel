<?php

namespace App\Http\Controllers;

use App\Models\CourierRequest;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourierController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::whereIn('status', ['confirmed', 'preparing', 'ready', 'picked_up'])
            ->orderBy('created_at')
            ->get([
                'id', 'restaurant_name', 'customer_name', 'phone', 'address',
                'total', 'status', 'courier_id', 'estimated_ready_at',
                'estimated_delivery_at', 'created_at', 'items',
            ]);

        $packages = CourierRequest::whereIn('status', ['searching', 'assigned', 'picked_up'])
            ->with(['fromZone:id,name', 'toZone:id,name'])
            ->orderBy('created_at')
            ->get();

        return Inertia::render('Courier', ['orders' => $orders, 'packages' => $packages]);
    }

    public function claim(Request $request, Order $order)
    {
        $this->authorize('update', $order);

        if ($order->courier_id !== null) {
            return back()->with('error', 'Cette course a déjà été prise.');
        }

        $order->update(['courier_id' => $request->user()->id]);

        return back()->with('success', 'Commande prise.');
    }
}
