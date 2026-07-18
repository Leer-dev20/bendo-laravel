<?php

namespace App\Http\Controllers;

use App\Events\OrderStatusUpdated;
use App\Models\Order;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\MenuItem;
use Illuminate\Validation\ValidationException;
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
   public function checkout(Request $request)
{
    return Inertia::render('Checkout', [
        'walletBalance' => $request->user()->getOrCreateWallet()->balance,
    ]);
}

public function store(Request $request)
{
    $data = $request->validate([
        'restaurant_slug' => 'required|string|exists:restaurants,slug',
        'customer_name' => 'required|string|max:100',
        'phone' => 'required|string|max:32',
        'address' => 'required|string|max:300',
        'notes' => 'nullable|string|max:500',
        'items' => 'required|array|min:1',
        'items.*.id' => 'required|integer|exists:menu_items,id',
        'items.*.quantity' => 'required|integer|min:1',
        'payment_method' => 'required|in:cash,wallet,card,wave,orange_money',
    ]);

    $restaurant = Restaurant::where('slug', $data['restaurant_slug'])->firstOrFail();
    $platformFee = 3;
    $menuItems = MenuItem::whereIn('id', collect($data['items'])->pluck('id'))->get()->keyBy('id');

    $subtotal = collect($data['items'])->sum(fn ($item) => $menuItems[$item['id']]->price * $item['quantity']);
    $deliveryFee = $restaurant->delivery_fee;
    $total = $subtotal + $deliveryFee + $platformFee;

    if ($data['payment_method'] === 'wallet') {
        $wallet = $request->user()->getOrCreateWallet();
        if ($wallet->balance < $total) {
            throw ValidationException::withMessages(['payment_method' => 'Solde cagnotte insuffisant.']);
        }
    }

    $order = DB::transaction(function () use ($data, $restaurant, $request, $subtotal, $deliveryFee, $platformFee, $total, $menuItems) {
        $order = Order::create([
            'user_id' => $request->user()->id,
            'restaurant_slug' => $restaurant->slug,
            'restaurant_name' => $restaurant->name,
            'customer_name' => $data['customer_name'],
            'phone' => $data['phone'],
            'address' => $data['address'],
            'notes' => $data['notes'] ?? null,
            'items' => collect($data['items'])->map(fn ($i) => [
                'id' => $i['id'],
                'name' => $menuItems[$i['id']]->name,
                'price' => $menuItems[$i['id']]->price,
                'quantity' => $i['quantity'],
            ])->all(),
            'subtotal' => $subtotal,
            'delivery_fee' => $deliveryFee,
            'platform_fee' => $platformFee,
            'total' => $total,
            'payment_method' => $data['payment_method'],
            'payment_status' => match ($data['payment_method']) {
                'cash' => 'pending',
                'wallet' => 'paid',
                default => 'awaiting_payment',
            },
            'status' => in_array($data['payment_method'], ['card', 'wave', 'orange_money']) ? 'pending_payment' : 'confirmed',
        ]);

        if ($data['payment_method'] === 'wallet') {
            $request->user()->getOrCreateWallet()->debit($total, $order->id, "Commande {$restaurant->name}");
        }

        return $order;
    });

    if (in_array($data['payment_method'], ['card', 'wave', 'orange_money'])) {
        return redirect()->route('checkout.payment', $order);
    }

    return redirect()->route('orders.confirmation', $order)->with('success', 'Commande confirmée');
}

public function confirmation(Order $order)
{
    $this->authorize('view', $order);

    return Inertia::render('OrderConfirmation', ['order' => $order]);
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
