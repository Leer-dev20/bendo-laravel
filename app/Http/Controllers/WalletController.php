<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class WalletController extends Controller
{
    public function show(Request $request)
    {
        $wallet = $request->user()->getOrCreateWallet();
        $wallet->load(['transactions' => fn ($q) => $q->latest()->limit(50)]);

        return Inertia::render('Wallet/Show', ['wallet' => $wallet]);
    }

    /**
     * Initie un rechargement (topup). Le crédit réel du wallet se fait
     * seulement après confirmation du paiement (voir PaymentController::verify).
     */
    public function topup(Request $request)
    {
        $data = $request->validate([
            'amount' => 'required|integer|min:100', // en centimes ou plus petite unité
            'provider' => 'required|in:stripe,wave,orange_money',
        ]);

        return app(\App\Services\Payment\PaymentManager::class)
            ->driver($data['provider'])
            ->initiateTopup($request->user(), $data['amount']);
    }
}
