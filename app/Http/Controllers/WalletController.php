<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class WalletController extends Controller
{
    public function show(Request $request)
    {
        $wallet = $request->user()->getOrCreateWallet();
        $wallet->load(['transactions' => fn ($q) => $q->latest()->limit(30)]);

        return Inertia::render('Subscription', ['wallet' => $wallet]);
    }

    /**
     * Recharge démo : crédite directement, sans passer par un vrai paiement.
     * Utile en développement / démonstration, à retirer (ou protéger) en prod.
     */
    public function topupDemo(Request $request)
    {
        $data = $request->validate([
            'amount' => 'required|integer|min:20|max:10000',
        ]);

        $wallet = $request->user()->getOrCreateWallet();
        $wallet->credit($data['amount'], 'topup', 'Recharge démo (sans paiement)');

        return back()->with('success', "+{$data['amount']} MAD ajoutés à ta cagnotte");
    }

    public function topup(Request $request)
    {
        $data = $request->validate([
            'amount' => 'required|integer|min:20|max:10000',
            'provider' => 'required|in:stripe,wave,orange_money',
        ]);

        return app(\App\Services\Payment\PaymentManager::class)
            ->driver($data['provider'])
            ->initiateTopup($request->user(), $data['amount']);
    }
}
