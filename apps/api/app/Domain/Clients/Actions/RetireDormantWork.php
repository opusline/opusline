<?php

declare(strict_types=1);

namespace App\Domain\Clients\Actions;

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Enums\MissionStatus;
use App\Domain\Missions\Models\Mission;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

/**
 * Finishes the missions and archives the clients an account has stopped
 * touching, for an account that asked for it.
 *
 * Silence is the only signal: no time tracked and no invoice issued since the
 * cutoff. Deliberately not the mission's `end_date` — a mission can outlive the
 * date it was meant to end, and one that never had a date would be immortal.
 *
 * Nothing here is destructive. A finished mission goes back to active in a
 * click, an archived client is unarchived in one, and neither loses a row.
 */
class RetireDormantWork
{
    public function __construct(private readonly ArchiveClient $archiveClient) {}

    /**
     * @return array{missions: int, clients: int}
     */
    public function handle(User $user, CarbonImmutable $today): array
    {
        $months = $user->settingsOrFail()->dormant_after_months;

        if ($months === null) {
            return ['missions' => 0, 'clients' => 0];
        }

        $cutoff = $today->subMonthsNoOverflow($months);

        return [
            'missions' => $this->finishDormantMissions($user, $cutoff),
            'clients' => $this->archiveDormantClients($user, $cutoff),
        ];
    }

    /**
     * A mission is dormant when nothing has happened on it since the cutoff —
     * including the day it was created, so a mission opened this morning is
     * never retired the same night for having no time on it yet.
     */
    private function finishDormantMissions(User $user, CarbonImmutable $cutoff): int
    {
        $missions = $user->missions()
            ->whereIn('status', [MissionStatus::Active, MissionStatus::Paused])
            ->where('created_at', '<', $cutoff)
            ->whereDoesntHave('timeEntries', fn ($entries) => $entries->where('date', '>=', $cutoff->toDateString()))
            ->whereDoesntHave('invoices', fn ($invoices) => $invoices->where('issued_on', '>=', $cutoff->toDateString()))
            ->get();

        foreach ($missions as $mission) {
            $mission->update(['status' => MissionStatus::Done]);
        }

        return $missions->count();
    }

    /**
     * A client follows its missions: it is archived once none of them is still
     * running — which the pass above may have just arranged — and nothing has
     * been invoiced to it since the cutoff. A client with no mission at all
     * qualifies too, which is what an abandoned prospect looks like.
     */
    private function archiveDormantClients(User $user, CarbonImmutable $cutoff): int
    {
        $clients = $user->clients()
            ->whereNull('archived_at')
            ->where('created_at', '<', $cutoff)
            ->whereDoesntHave('missions', fn ($missions) => $missions->whereIn('status', [MissionStatus::Active, MissionStatus::Paused]))
            ->whereDoesntHave('invoices', fn ($invoices) => $invoices->where('issued_on', '>=', $cutoff->toDateString()))
            ->whereDoesntHave('missions.timeEntries', fn ($entries) => $entries->where('date', '>=', $cutoff->toDateString()))
            ->get();

        foreach ($clients as $client) {
            $this->archiveClient->handle($client);
        }

        return $clients->count();
    }
}
