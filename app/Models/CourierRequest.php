<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourierRequest extends Model
{
    protected $fillable = [
        'user_id', 'from_zone_id', 'to_zone_id', 'pickup_address', 'dropoff_address',
        'recipient_name', 'recipient_phone', 'package_description', 'price',
        'payment_method', 'payment_status', 'status', 'courier_id',
        'assigned_at', 'picked_up_at', 'delivered_at',
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
        'picked_up_at' => 'datetime',
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

    public function fromZone(): BelongsTo
    {
        return $this->belongsTo(Zone::class, 'from_zone_id');
    }

    public function toZone(): BelongsTo
    {
        return $this->belongsTo(Zone::class, 'to_zone_id');
    }
}
