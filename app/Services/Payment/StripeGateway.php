<?php

namespace App\Services\Payment;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Stripe\Checkout\Session;
use Stripe\StripeClient;

class StripeGateway implements PaymentGateway
{
    private StripeClient $stripe;

    public function __construct()
    {
        $this->stripe = new StripeClient(config('services.stripe.secret'));
    }

    public function initiateOrderPayment(Order $order): RedirectResponse
    {
        $session = $this->stripe->checkout->sessions->create([
            'mode' => 'payment',
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'mad',
                    'product_data' => ['name' => "Commande {$order->restaurant_name}"],
                    'unit_amount' => $order->total * 100,
                ],
                'quantity' => 1,
            ]],
            'customer_email' => $order->user->email,
            'success_url' => route('payment.return', ['kind' => 'order']).'?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('orders.show', $order),
            'metadata' => ['order_id' => $order->id, 'user_id' => $order->user_id, 'kind' => 'order'],
        ]);

        return redirect()->away($session->url);
    }

    public function initiateTopup(User $user, int $amount): RedirectResponse
    {
        $session = $this->stripe->checkout->sessions->create([
            'mode' => 'payment',
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'mad',
                    'product_data' => ['name' => 'Rechargement cagnotte Bendo'],
                    'unit_amount' => $amount * 100,
                ],
                'quantity' => 1,
            ]],
            'customer_email' => $user->email,
            'success_url' => route('payment.return', ['kind' => 'topup']).'?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('wallet.show'),
            'metadata' => ['user_id' => $user->id, 'amount' => $amount, 'kind' => 'topup'],
        ]);

        return redirect()->away($session->url);
    }

    /**
     * Équivalent de verify-payment : relit la session Stripe et applique
     * l'effet correspondant (confirmer commande ou créditer wallet).
     */
    public function verify(string $reference): bool
    {
        $session = $this->stripe->checkout->sessions->retrieve($reference);

        if ($session->payment_status !== 'paid') {
            return false;
        }

        $kind = $session->metadata['kind'] ?? null;

        if ($kind === 'order') {
            $order = Order::findOrFail($session->metadata['order_id']);
            if ($order->payment_status !== 'paid') {
                $order->update(['payment_status' => 'paid', 'status' => 'confirmed']);
            }
        } elseif ($kind === 'topup') {
            $user = User::findOrFail($session->metadata['user_id']);
            $wallet = $user->getOrCreateWallet();
            // Idempotence : on ne crédite pas deux fois la même session Stripe.
            $already = $wallet->transactions()->where('description', $reference)->exists();
            if (! $already) {
                $wallet->credit((int) $session->metadata['amount'], 'topup', $reference);
            }
        }

        return true;
    }
}
