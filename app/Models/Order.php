<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'restaurant_slug', 'restaurant_name', 'customer_name', 'phone',
        'address', 'notes', 'items', 'subtotal', 'delivery_fee', 'platform_fee',
        'total', 'payment_method', 'payment_status', 'status', 'courier_id',
        'prep_minutes', 'estimated_ready_at', 'estimated_delivery_at', 'delivered_at',
    ];

    protected $casts = [
        'items' => 'array',
        'estimated_ready_at' => 'datetime',
        'estimated_delivery_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function courier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'courier_id');
    }

    public function statusHistory(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class)->orderBy('created_at');
    }
}
