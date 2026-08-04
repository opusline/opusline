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

        $nordlys = Client::factory()->for($user)->intermediary()->create([
            'name' => 'Nordlys',
            'color' => Color::Amber,
            'siret' => '123 456 789 00012',
            'billing_contact_name' => 'Camille Dupont',
            'billing_email' => 'factures@nordlys.example',
            'created_at' => now()->subMonths(17),
        ]);

        Mission::factory()->for($nordlys, 'client')->throughEsn('Callisto')->create([
            'user_id' => $user->id,
            'name' => 'Callisto front',
            'rate_cents' => 55_000,
            'cra_required' => true,
            'start_date' => '2025-03-03',
        ]);

        Mission::factory()->for($nordlys, 'client')->throughEsn('Callisto')->done()->create([
            'user_id' => $user->id,
            'name' => 'Callisto socle API',
            'rate_cents' => 52_000,
            'cra_required' => true,
            'start_date' => '2025-03-03',
            'end_date' => '2026-05-29',
        ]);

        $lunaprint = Client::factory()->for($user)->create([
            'name' => 'Lunaprint',
            'color' => Color::Slate,
            'created_at' => now()->subMonths(11),
        ]);

        Mission::factory()->for($lunaprint, 'client')->hourly()->create([
            'user_id' => $user->id,
            'name' => 'Lunaprint maintenance',
        ]);

        Client::factory()->for($user)->archived()->create([
            'name' => 'Studio Lorem',
            'color' => Color::Plum,
            'created_at' => now()->subMonths(20),
        ]);

        Client::factory()->for($user)->create([
            'name' => 'Ateliers Ruche',
            'color' => Color::Sage,
            'created_at' => now()->subDays(2),
        ]);

        $perso = Client::factory()->for($user)->internal()->create([
            'name' => 'Perso',
            'color' => Color::Stone,
            'created_at' => now()->subMonths(20),
        ]);

        Mission::factory()->for($perso, 'client')->hourly()->nonBillable()->create([
            'user_id' => $user->id,
            'name' => 'Opusline',
        ]);
    }
}
