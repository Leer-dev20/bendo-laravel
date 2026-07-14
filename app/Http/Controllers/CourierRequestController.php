<?php

namespace App\Http\Controllers;

use App\Models\CourierRequest;
use App\Models\Zone;
use App\Models\ZoneRate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourierRequestController extends Controller
{
    public function create()
{
    return Inertia::render('CourierRequest/Create', [
        'zones' => Zone::orderBy('name')->get(['id', 'name']),
        'rates' => ZoneRate::all(['from_zone_id', 'to_zone_id', 'price']),
    ]);
}

    public function store(Request $request)
    {
        $data = $request->validate([
            'from_zone_id' => 'required|exists:zones,id',
            'to_zone_id' => 'required|exists:zones,id',
            'pickup_address' => 'required|string|max:255',
            'dropoff_address' => 'required|string|max:255',
            'recipient_name' => 'required|string|max:255',
            'recipient_phone' => 'required|string|max:32',
            'package_description' => 'nullable|string|max:255',
            'payment_method' => 'required|in:cash,card,wallet,wave,orange_money',
        ]);

        $price = \App\Models\ZoneRate::priceFor($data['from_zone_id'], $data['to_zone_id']);

        $courierRequest = CourierRequest::create([
            ...$data,
            'user_id' => $request->user()->id,
            'price' => $price,
            'payment_status' => $data['payment_method'] === 'cash' ? 'pending' : 'awaiting_payment',
            'status' => $data['payment_method'] === 'cash' ? 'searching' : 'pending_payment',
        ]);

        if ($data['payment_method'] === 'cash') {
            return redirect()->route('courier-requests.show', $courierRequest)
                ->with('success', 'Recherche d\'un coursier en cours...');
        }

        return redirect()->route('checkout.courier-payment', $courierRequest);
    }

    public function index(Request $request)
    {
        $requests = $request->user()->courierRequests()
            ->with(['fromZone', 'toZone', 'courier'])
            ->latest()
            ->get();

        return Inertia::render('CourierRequest/Index', ['requests' => $requests]);
    }

    public function show(CourierRequest $courierRequest)
    {
        $this->authorize('view', $courierRequest);

        $courierRequest->load(['fromZone', 'toZone', 'courier']);

        return Inertia::render('CourierRequest/Show', ['courierRequest' => $courierRequest]);
    }

    public function claim(Request $request, CourierRequest $courierRequest)
{
    $this->authorize('update', $courierRequest);

    if ($courierRequest->courier_id !== null) {
        return back()->with('error', 'Cette course a déjà été prise.');
    }

    $courierRequest->update([
        'courier_id' => $request->user()->id,
        'status' => 'assigned',
        'assigned_at' => now(),
    ]);

    return back()->with('success', 'Course prise.');
}

public function updateStatus(Request $request, CourierRequest $courierRequest)
{
    $this->authorize('update', $courierRequest);

    $data = $request->validate([
        'status' => 'required|in:picked_up,delivered,cancelled',
    ]);

    $courierRequest->status = $data['status'];
    if ($data['status'] === 'picked_up') {
        $courierRequest->picked_up_at = now();
    }
    if ($data['status'] === 'delivered') {
        $courierRequest->delivered_at = now();
    }
    $courierRequest->save();

    return back();
}
}
