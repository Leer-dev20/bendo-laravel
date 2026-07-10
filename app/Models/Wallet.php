<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Wallet extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'balance'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(WalletTransaction::class);
    }

    /**
     * Débite le wallet de façon atomique (équivalent de wallet_debit() côté Supabase).
     *
     * @throws \RuntimeException si solde insuffisant
     */
    public function debit(int $amount, ?int $orderId, string $description): self
    {
        return \DB::transaction(function () use ($amount, $orderId, $description) {
            $wallet = self::where('id', $this->id)->lockForUpdate()->firstOrFail();

            if ($amount <= 0) {
                throw new \InvalidArgumentException('Le montant doit être positif.');
            }
            if ($wallet->balance < $amount) {
                throw new \RuntimeException('Solde insuffisant.');
            }

            $wallet->decrement('balance', $amount);

            $wallet->transactions()->create([
                'user_id' => $wallet->user_id,
                'amount' => -$amount,
                'type' => 'order_debit',
                'description' => $description,
                'order_id' => $orderId,
            ]);

            return $wallet->fresh();
        });
    }

    public function credit(int $amount, string $type, string $description, ?int $orderId = null): self
    {
        return \DB::transaction(function () use ($amount, $type, $description, $orderId) {
            $wallet = self::where('id', $this->id)->lockForUpdate()->firstOrFail();
            $wallet->increment('balance', $amount);

            $wallet->transactions()->create([
                'user_id' => $wallet->user_id,
                'amount' => $amount,
                'type' => $type,
                'description' => $description,
                'order_id' => $orderId,
            ]);

            return $wallet->fresh();
        });
    }
}
