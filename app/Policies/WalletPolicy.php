<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Wallet;

class WalletPolicy
{
    public function view(User $user, Wallet $wallet): bool
    {
        return $wallet->user_id === $user->id || $user->isAdmin();
    }

    public function update(User $user, Wallet $wallet): bool
    {
        // Le solde n'est jamais modifié directement par l'utilisateur,
        // uniquement via credit()/debit() appelés par les services de paiement.
        return $user->isAdmin();
    }
}
