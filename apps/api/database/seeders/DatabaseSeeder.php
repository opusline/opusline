<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Enums\Color;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Timers\Models\RunningTimer;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
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
            'siret' => '443 061 841 00047',
            'billing_contact_name' => 'Camille Dupont',
            'billing_email' => 'factures@nordlys.example',
            'created_at' => now()->subMonths(17),
        ]);

        $callistoFront = Mission::factory()->for($nordlys, 'client')->throughEsn('Callisto')->create([
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

        $lunaprintMaintenance = Mission::factory()->for($lunaprint, 'client')->hourly()->create([
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

        $opusline = Mission::factory()->for($perso, 'client')->hourly()->nonBillable()->create([
            'user_id' => $user->id,
            'name' => 'Opusline',
        ]);

        $this->seedRecentTimeEntries($user, $callistoFront, $lunaprintMaintenance, $opusline);

        RunningTimer::factory()
            ->for($lunaprintMaintenance, 'mission')
            ->startedAt(CarbonImmutable::now()->subHours(2))
            ->create([
                'user_id' => $user->id,
                'note' => 'Correctif impression recto-verso',
            ]);
    }

    private function seedRecentTimeEntries(
        User $user,
        Mission $daily,
        Mission $hourly,
        Mission $nonBillable,
    ): void {
        $workedDays = [];
        $cursor = CarbonImmutable::today();

        while (count($workedDays) < 10) {
            if (! $cursor->isWeekend()) {
                $workedDays[] = $cursor;
            }

            $cursor = $cursor->subDay();
        }

        $missionNotes = [
            'Sprint 24 · specs',
            'Filtre agences',
            'Revue PR',
            'Cadrage V2',
            'Rétro + backlog',
        ];

        $sideProjectNotes = [
            'Écran semaine',
            'Calculateur virement',
            'Notes de version',
        ];

        foreach ($workedDays as $index => $day) {
            TimeEntry::factory()->for($daily, 'mission')->create([
                'user_id' => $user->id,
                'date' => $day->toDateString(),
                'duration_minutes' => $index % 5 === 0 ? 210 : 420,
                'note' => $missionNotes[$index % count($missionNotes)],
            ]);

            if ($index % 3 === 1) {
                TimeEntry::factory()->for($nonBillable, 'mission')->nonBillable()->create([
                    'user_id' => $user->id,
                    'date' => $day->toDateString(),
                    'duration_minutes' => $index % 2 === 1 ? 120 : 90,
                    'note' => $sideProjectNotes[intdiv($index, 3) % count($sideProjectNotes)],
                ]);
            }

            if ($index % 3 !== 0) {
                continue;
            }

            TimeEntry::factory()->for($hourly, 'mission')->create([
                'user_id' => $user->id,
                'date' => $day->toDateString(),
                'duration_minutes' => 95,
                'note' => 'Correctifs après mise en production.',
            ]);
        }
    }
}
