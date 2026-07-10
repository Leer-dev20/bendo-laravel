<?php

namespace App\Http\Controllers;

use App\Events\OrderStatusUpdated;
use App\Models\Order;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $orders = $user->isAdmin()
            ? Order::latest()->paginate(20)
            : ($user->isCourier()
                ? Order::whereIn('status', ['ready', 'preparing'])
                    ->orWhere('courier_id', $user->id)
                    ->latest()->paginate(20)
                : $user->orders()->latest()->paginate(20));

        return Inertia::render('Orders/Index', ['orders' => $orders]);
    }

    public function show(Order $order)
    {
        $this->authorize('view', $order);

        $order->load(['statusHistory', 'courier']);

        return Inertia::render('Orders/Show', ['order' => $order]);
    }

    /**
     * Crée une commande. Le paiement (Stripe/Wave/Orange Money/wallet)
     * est géré séparément par PaymentController après validation du panier.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'restaurant_slug' => 'required|string|exists:restaurants,slug',
            'customer_name' => 'required|string|max:255',
            'phone' => 'required|string|max:32',
            'address' => 'required|string|max:500',
            'notes' => 'nullable|string|max:500',
            'items' => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|integer|exists:menu_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|in:cash,card,wallet,wave,orange_money',
        ]);

        $restaurant = Restaurant::where('slug', $data['restaurant_slug'])->firstOrFail();

        $order = DB::transaction(function () use ($data, $restaurant, $request) {
            $subtotal = collect($data['items'])->sum(function ($item) {
                return \App\Models\MenuItem::findOrFail($item['menu_item_id'])->price * $item['quantity'];
            });

            $platformFee = (int) round($subtotal * 0.05); // commission plateforme 5%, à ajuster
            $deliveryFee = $restaurant->delivery_fee;

            return Order::create([
                'user_id' => $request->user()->id,
                'restaurant_slug' => $restaurant->slug,
                'restaurant_name' => $restaurant->name,
                'customer_name' => $data['customer_name'],
                'phone' => $data['phone'],
                'address' => $data['address'],
                'notes' => $data['notes'] ?? null,
                'items' => $data['items'],
                'subtotal' => $subtotal,
                'delivery_fee' => $deliveryFee,
                'platform_fee' => $platformFee,
                'total' => $subtotal + $deliveryFee,
                'payment_method' => $data['payment_method'],
                'payment_status' => $data['payment_method'] === 'cash' ? 'pending' : 'awaiting_payment',
                'status' => 'pending_payment',
            ]);
        });

        return redirect()->route('checkout.payment', $order)
            ->with('success', 'Commande créée, en attente de paiement.');
    }

    /**
     * Mise à jour du statut par un coursier ou un admin.
     */
    public function updateStatus(Request $request, Order $order)
    {
        $this->authorize('update', $order);

        $data = $request->validate([
            'status' => 'required|in:confirmed,preparing,ready,picked_up,delivered,cancelled',
        ]);

        if ($data['status'] === 'picked_up' && ! $order->courier_id) {
            $order->courier_id = $request->user()->id;
        }

        $order->status = $data['status'];
        $order->save();

        broadcast(new OrderStatusUpdated($order))->toOthers();

        return back()->with('success', 'Statut mis à jour.');
    }
}
