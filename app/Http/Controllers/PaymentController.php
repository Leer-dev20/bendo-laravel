<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\Payment\PaymentManager;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function __construct(private PaymentManager $payments)
    {
    }

    /**
     * Lance le paiement d'une commande (redirige vers Stripe/Wave/Orange Money).
     */
    public function payForOrder(Request $request, Order $order)
    {
        $this->authorize('view', $order);

        return $this->payments->driver($order->payment_method)->initiateOrderPayment($order);
    }

    /**
     * Page de retour après paiement (success_url des passerelles).
     * Vérifie le paiement puis affiche la confirmation.
     */
    public function return(Request $request)
    {
        $data = $request->validate([
            'kind' => 'required|in:order,topup',
            'session_id' => 'nullable|string',
            'reference' => 'nullable|string',
        ]);

        $reference = $data['session_id'] ?? $data['reference'] ?? null;
        $provider = $request->query('provider', 'stripe');

        $verified = $reference
            ? $this->payments->driver($provider)->verify($reference)
            : false;

        return Inertia::render('Payment/Return', [
            'kind' => $data['kind'],
            'success' => $verified,
        ]);
    }

    /**
     * Webhook Orange Money (notif_url) : confirme le paiement côté serveur,
     * indépendamment du retour navigateur.
     */
    public function orangeMoneyWebhook(Request $request)
    {
        $orderId = $request->input('order_id');
        if ($orderId) {
            $this->payments->driver('orange_money')->verify($orderId);
        }

        return response()->json(['status' => 'ok']);
    }

    /**
     * Webhook Stripe : recommandé en complément du retour navigateur
     * pour ne jamais dépendre uniquement du client.
     */
    public function stripeWebhook(Request $request)
    {
        $event = \Stripe\Webhook::constructEvent(
            $request->getContent(),
            $request->header('Stripe-Signature'),
            config('services.stripe.webhook_secret'),
        );

        if ($event->type === 'checkout.session.completed') {
            $this->payments->driver('stripe')->verify($event->data->object->id);
        }

        return response()->json(['status' => 'ok']);
    }
}
