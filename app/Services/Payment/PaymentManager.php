<?php

namespace App\Services\Payment;

class PaymentManager
{
    public function driver(string $provider): PaymentGateway
    {
        return match ($provider) {
            'stripe' => app(StripeGateway::class),
            'wave' => app(WaveGateway::class),
            'orange_money' => app(OrangeMoneyGateway::class),
            default => throw new \InvalidArgumentException("Fournisseur de paiement inconnu : {$provider}"),
        };
    }
}
