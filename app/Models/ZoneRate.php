<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ZoneRate extends Model
{
    protected $fillable = ['from_zone_id', 'to_zone_id', 'price'];

    public static function priceFor(int $fromZoneId, int $toZoneId): int
    {
        return static::where('from_zone_id', $fromZoneId)
            ->where('to_zone_id', $toZoneId)
            ->value('price') ?? 25;
    }
}
