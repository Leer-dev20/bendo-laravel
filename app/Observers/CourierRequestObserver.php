<?php

namespace App\Observers;

use App\Models\CourierRequest;

class CourierRequestObserver
{
    public function creating(CourierRequest $request): void
    {
        if (! $request->estimated_pickup_at) {
            $request->estimated_pickup_at = now()->addMinutes(15);
        }
        if (! $request->estimated_delivery_at) {
            $request->estimated_delivery_at = $request->estimated_pickup_at->clone()->addMinutes(20);
        }
    }
}
