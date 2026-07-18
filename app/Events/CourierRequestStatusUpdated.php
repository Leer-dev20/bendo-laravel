<?php

namespace App\Events;

use App\Models\CourierRequest;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CourierRequestStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public CourierRequest $courierRequest)
    {
    }

    public function broadcastOn(): array
    {
        return [new PrivateChannel('courier-requests.'.$this->courierRequest->id)];
    }

    public function broadcastAs(): string
    {
        return 'courier-request.status.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->courierRequest->id,
            'status' => $this->courierRequest->status,
            'courier_id' => $this->courierRequest->courier_id,
            'estimated_pickup_at' => $this->courierRequest->estimated_pickup_at,
            'estimated_delivery_at' => $this->courierRequest->estimated_delivery_at,
        ];
    }
}
