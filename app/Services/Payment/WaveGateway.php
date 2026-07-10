<?php

namespace App\Services\Payment;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Http;

/**
 * Intégration Wave Checkout (API Sénégal/Sénégal-adjacente).
 * Doc officielle : https://docs.wave.com/business
 *
 * Nécessite dans .env :
 *   WAVE_API_KEY=xxx
 */
class WaveGateway implements PaymentGateway
{
    private string $baseUrl = 'https://api.wave.com/v1';

    public function initiateOrderPayment(Order $order): RedirectResponse
    {
        $response = $this->createCheckoutSession(
            amount: $order->total,
            successUrl: route('payment.return', ['kind' => 'order']),
            errorUrl: route('orders.show', $order),
            metadata: ['order_id' => $order->id, 'kind' => 'order'],
        );

        return redirect()->away($response['wave_launch_url']);
    }

    public function initiateTopup(User $user, int $amount): RedirectResponse
    {
        $response = $this->createCheckoutSession(
            amount: $amount,
            successUrl: route('payment.return', ['kind' => 'topup']),
            errorUrl: route('wallet.show'),
            metadata: ['user_id' => $user->id, 'amount' => $amount, 'kind' => 'topup'],
        );

        return redirect()->away($response['wave_launch_url']);
    }

    /**
     * Vérifie le statut d'une session Wave via son id, puis applique l'effet
     * (confirmer commande ou créditer wallet), de façon idempotente.
     */
    public function verify(string $reference): bool
    {
        $response = Http::withToken(config('services.wave.api_key'))
            ->get("{$this->baseUrl}/checkout/sessions/{$reference}")
            ->throw()
            ->json();

        if ($response['payment_status'] !== 'succeeded') {
            return false;
        }

        $metadata = $response['client_reference'] ? json_decode($response['client_reference'], true) : [];
        $kind = $metadata['kind'] ?? null;

        if ($kind === 'order') {
            $order = Order::findOrFail($metadata['order_id']);
            if ($order->payment_status !== 'paid') {
                $order->update(['payment_status' => 'paid', 'status' => 'confirmed']);
            }
        } elseif ($kind === 'topup') {
            $user = User::findOrFail($metadata['user_id']);
            $wallet = $user->getOrCreateWallet();
            $already = $wallet->transactions()->where('description', $reference)->exists();
            if (! $already) {
                $wallet->credit((int) $metadata['amount'], 'topup', $reference);
            }
        }

        return true;
    }

    private function createCheckoutSession(int $amount, string $successUrl, string $errorUrl, array $metadata): array
    {
        return Http::withToken(config('services.wave.api_key'))
            ->post("{$this->baseUrl}/checkout/sessions", [
                'amount' => (string) $amount,
                'currency' => 'XOF',
                'success_url' => $successUrl,
                'error_url' => $errorUrl,
                'client_reference' => json_encode($metadata),
            ])
            ->throw()
            ->json();
    }
}
