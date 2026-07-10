<?php

namespace App\Services\Payment;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

/**
 * Intégration Orange Money Web Payment API.
 * Doc officielle : https://developer.orange.com/apis/om-webpay
 *
 * Nécessite dans .env :
 *   ORANGE_MONEY_CLIENT_ID=xxx
 *   ORANGE_MONEY_CLIENT_SECRET=xxx
 *   ORANGE_MONEY_MERCHANT_KEY=xxx
 */
class OrangeMoneyGateway implements PaymentGateway
{
    private string $baseUrl = 'https://api.orange.com/orange-money-webpay/dev/v1';

    public function initiateOrderPayment(Order $order): RedirectResponse
    {
        $response = $this->createPayment(
            amount: $order->total,
            reference: 'order-'.$order->id,
            returnUrl: route('payment.return', ['kind' => 'order']),
            cancelUrl: route('orders.show', $order),
        );

        return redirect()->away($response['payment_url']);
    }

    public function initiateTopup(User $user, int $amount): RedirectResponse
    {
        $response = $this->createPayment(
            amount: $amount,
            reference: 'topup-'.$user->id.'-'.now()->timestamp,
            returnUrl: route('payment.return', ['kind' => 'topup']),
            cancelUrl: route('wallet.show'),
        );

        Cache::put('om_topup_'.$response['pay_token'], ['user_id' => $user->id, 'amount' => $amount], now()->addHour());

        return redirect()->away($response['payment_url']);
    }

    public function verify(string $reference): bool
    {
        $status = Http::withToken($this->accessToken())
            ->get("{$this->baseUrl}/transactionstatus", ['orderId' => $reference])
            ->throw()
            ->json();

        if (($status['status'] ?? null) !== 'SUCCESS') {
            return false;
        }

        if (str_starts_with($reference, 'order-')) {
            $order = Order::findOrFail(str_replace('order-', '', $reference));
            if ($order->payment_status !== 'paid') {
                $order->update(['payment_status' => 'paid', 'status' => 'confirmed']);
            }
        } elseif (str_starts_with($reference, 'topup-')) {
            $meta = Cache::get('om_topup_'.$reference);
            if ($meta) {
                $user = User::findOrFail($meta['user_id']);
                $wallet = $user->getOrCreateWallet();
                $already = $wallet->transactions()->where('description', $reference)->exists();
                if (! $already) {
                    $wallet->credit((int) $meta['amount'], 'topup', $reference);
                }
            }
        }

        return true;
    }

    private function accessToken(): string
    {
        return Cache::remember('orange_money_token', 3500, function () {
            $response = Http::asForm()
                ->withBasicAuth(config('services.orange_money.client_id'), config('services.orange_money.client_secret'))
                ->post('https://api.orange.com/oauth/v3/token', ['grant_type' => 'client_credentials'])
                ->throw()
                ->json();

            return $response['access_token'];
        });
    }

    private function createPayment(int $amount, string $reference, string $returnUrl, string $cancelUrl): array
    {
        return Http::withToken($this->accessToken())
            ->post("{$this->baseUrl}/webpayment", [
                'merchant_key' => config('services.orange_money.merchant_key'),
                'currency' => 'OUV',
                'order_id' => $reference,
                'amount' => $amount,
                'return_url' => $returnUrl,
                'cancel_url' => $cancelUrl,
                'notif_url' => route('payment.webhook.orange_money'),
                'lang' => 'fr',
            ])
            ->throw()
            ->json();
    }
}
