<?php

namespace App\Services\Payment;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

interface PaymentGateway
{
    /**
     * Démarre un paiement pour une commande et renvoie une redirection
     * vers la page de paiement du prestataire (Stripe Checkout, Wave, etc.)
     */
    public function initiateOrderPayment(Order $order): RedirectResponse;

    /**
     * Démarre un rechargement de wallet.
     */
    public function initiateTopup(User $user, int $amount): RedirectResponse;

    /**
     * Vérifie et confirme un paiement à partir de la référence renvoyée
     * par le prestataire (session_id Stripe, référence Wave, etc.)
     */
    public function verify(string $reference): bool;
}
