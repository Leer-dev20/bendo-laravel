<?php

namespace App\Policies;

use App\Models\CourierRequest;
use App\Models\User;

class CourierRequestPolicy
{
    public function view(User $user, CourierRequest $request): bool
    {
        if ($request->user_id === $user->id || $user->isAdmin()) {
            return true;
        }

        return $user->isCourier()
            && ($request->courier_id === $user->id || $request->status === 'searching');
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, CourierRequest $request): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->isCourier() && ($request->courier_id === $user->id || $request->courier_id === null);
    }
}
