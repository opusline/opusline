<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Enums\Color;
use App\Domain\Users\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $catamania = Client::factory()->for($user)->intermediary()->create([
            'name' => 'Catamania',
            'color' => Color::Amber,
            'siret' => '892 447 118 00017',
            'billing_contact_name' => 'Sophie Reix',
            'billing_email' => 'factures@catamania.fr',
        ]);

        Mission::factory()->for($catamania, 'client')->throughEsn('OGF')->create([
            'user_id' => $user->id,
            'name' => 'OGF front',
            'rate_cents' => 55_000,
            'cra_required' => true,
            'start_date' => '2025-03-03',
        ]);

        Mission::factory()->for($catamania, 'client')->throughEsn('OGF')->done()->create([
            'user_id' => $user->id,
            'name' => 'OGF socle API',
            'rate_cents' => 52_000,
            'cra_required' => true,
            'start_date' => '2025-03-03',
            'end_date' => '2026-05-29',
        ]);

        $hartprint = Client::factory()->for($user)->create([
            'name' => 'HartPrint',
            'color' => Color::Slate,
        ]);

        Mission::factory()->for($hartprint, 'client')->hourly()->create([
            'user_id' => $user->id,
            'name' => 'HartPrint maintenance',
        ]);

        Client::factory()->for($user)->archived()->create([
            'name' => 'Studio Lorem',
            'color' => Color::Plum,
        ]);

        $perso = Client::factory()->for($user)->internal()->create([
            'name' => 'Perso',
            'color' => Color::Stone,
        ]);

        Mission::factory()->for($perso, 'client')->hourly()->nonBillable()->create([
            'user_id' => $user->id,
            'name' => 'Opusline',
        ]);
    }
}
