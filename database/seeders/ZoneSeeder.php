<?php

namespace Database\Seeders;

use App\Models\Zone;
use App\Models\ZoneRate;
use Illuminate\Database\Seeder;

class ZoneSeeder extends Seeder
{
    public function run(): void
    {
        $names = ['Maârif', 'Gauthier', 'Bourgogne', 'Habous', 'Agdal', 'Ain Diab', 'Sidi Maarouf', 'Hay Hassani'];

        $zones = collect($names)->mapWithKeys(fn ($name) => [
            $name => Zone::firstOrCreate(['name' => $name])->id,
        ]);

        foreach ($zones as $fromName => $fromId) {
            foreach ($zones as $toName => $toId) {
                $price = $fromId === $toId
                    ? 15
                    : 25 + (abs($fromId - $toId) * 3);

                ZoneRate::updateOrCreate(
                    ['from_zone_id' => $fromId, 'to_zone_id' => $toId],
                    ['price' => min($price, 60)],
                );
            }
        }
    }
}
