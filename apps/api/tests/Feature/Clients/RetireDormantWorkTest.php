<?php

declare(strict_types=1);

use App\Domain\Clients\Actions\RetireDormantWork;
use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Missions\Enums\MissionStatus;
use App\Domain\Missions\Models\Mission;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

/** The account's today in every test below, so the cutoffs read as calendar dates. */
const TODAY = '2026-09-11';

function retiring(User $user, ?int $months = 6): array
{
    $user->settings()->sole()->update(['dormant_after_months' => $months]);
    $user->refresh();

    return app(RetireDormantWork::class)->handle($user, CarbonImmutable::parse(TODAY));
}

function dormantMission(User $user, MissionStatus $status = MissionStatus::Active): Mission
{
    return Mission::factory()
        ->for(Client::factory()->for($user)->create(['created_at' => '2024-01-01']), 'client')
        ->create([
            'user_id' => $user->id,
            'status' => $status,
            'created_at' => '2024-01-01',
        ]);
}

test('finishes a mission nothing has happened on since the cutoff', function (): void {
    $user = User::factory()->create();
    $mission = dormantMission($user);

    expect(retiring($user)['missions'])->toBe(1);
    expect($mission->refresh()->status)->toBe(MissionStatus::Done);
});

test('finishes a paused mission too: it is still unfinished work', function (): void {
    $user = User::factory()->create();
    $mission = dormantMission($user, MissionStatus::Paused);

    retiring($user);

    expect($mission->refresh()->status)->toBe(MissionStatus::Done);
});

test('leaves a mission with time tracked since the cutoff alone', function (): void {
    $user = User::factory()->create();
    $mission = dormantMission($user);
    TimeEntry::factory()->for($mission, 'mission')->create([
        'date' => '2026-08-20',
        'duration_minutes' => 60,
    ]);

    expect(retiring($user)['missions'])->toBe(0);
    expect($mission->refresh()->status)->toBe(MissionStatus::Active);
});

test('leaves a mission invoiced since the cutoff alone', function (): void {
    $user = User::factory()->create();
    $mission = dormantMission($user);
    Invoice::factory()
        ->for($mission->client, 'client')
        ->for($mission, 'mission')
        ->create(['user_id' => $user->id, 'issued_on' => '2026-08-01']);

    expect(retiring($user)['missions'])->toBe(0);
});

test('leaves a mission younger than the cutoff alone, however quiet it is', function (): void {
    $user = User::factory()->create();
    $mission = dormantMission($user);
    $mission->forceFill(['created_at' => '2026-09-01'])->save();

    expect(retiring($user)['missions'])->toBe(0);
});

test('archives a client once none of its missions is running', function (): void {
    $user = User::factory()->create();
    $mission = dormantMission($user);

    $retired = retiring($user);

    expect($retired)->toBe(['missions' => 1, 'clients' => 1]);
    expect($mission->client->refresh()->archived_at)->not->toBeNull();
});

test('archives a client that never had a mission', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create(['created_at' => '2024-01-01']);

    expect(retiring($user)['clients'])->toBe(1);
    expect($client->refresh()->archived_at)->not->toBeNull();
});

test('keeps a client whose other mission is still running', function (): void {
    $user = User::factory()->create();
    $dormant = dormantMission($user);
    Mission::factory()->for($dormant->client, 'client')->create([
        'user_id' => $user->id,
        'status' => MissionStatus::Active,
        'created_at' => '2026-09-01',
    ]);

    expect(retiring($user)['clients'])->toBe(0);
    expect($dormant->client->refresh()->archived_at)->toBeNull();
});

test('keeps a client invoiced since the cutoff, even with nothing running', function (): void {
    $user = User::factory()->create();
    $mission = dormantMission($user);
    Invoice::factory()
        ->for($mission->client, 'client')
        ->create(['user_id' => $user->id, 'mission_id' => null, 'issued_on' => '2026-08-01']);

    expect(retiring($user)['clients'])->toBe(0);
});

test('does nothing at all for an account that has not asked for it', function (): void {
    $user = User::factory()->create();
    $mission = dormantMission($user);

    expect(retiring($user, null))->toBe(['missions' => 0, 'clients' => 0]);
    expect($mission->refresh()->status)->toBe(MissionStatus::Active);
    expect($mission->client->refresh()->archived_at)->toBeNull();
});

test('leaves another account alone', function (): void {
    $user = User::factory()->create();
    $stranger = User::factory()->create();
    $mission = dormantMission($stranger);

    retiring($user);

    expect($mission->refresh()->status)->toBe(MissionStatus::Active);
});

test('the scheduled command retires every account that asked for it', function (): void {
    $optedIn = User::factory()->create();
    $optedIn->settings()->sole()->update(['dormant_after_months' => 6]);
    $optedInMission = dormantMission($optedIn);

    $untouched = User::factory()->create();
    $untouchedMission = dormantMission($untouched);

    $this->artisan('clients:retire-dormant')
        ->expectsOutputToContain('Finished 1 mission(s) and archived 1 client(s).')
        ->assertSuccessful();

    expect($optedInMission->refresh()->status)->toBe(MissionStatus::Done);
    expect($untouchedMission->refresh()->status)->toBe(MissionStatus::Active);
});
