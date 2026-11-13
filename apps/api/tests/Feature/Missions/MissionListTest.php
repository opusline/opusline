<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Enums\MissionStatus;
use App\Domain\Missions\Models\Mission;
use App\Domain\Users\Models\User;

test('lists the missions of every client with the client\'s name', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create(['name' => 'Nordlys']);
    $mission = Mission::factory()->for($client, 'client')->create([
        'user_id' => $user->id,
        'name' => 'Nordlys platform',
        'billing_mode' => BillingMode::Daily,
        'status' => MissionStatus::Paused,
        'start_date' => '2026-09-01',
        'end_date' => '2027-02-26',
    ]);

    $this->actingAs($user)
        ->getJson('/api/missions')
        ->assertOk()
        ->assertJsonCount(1, 'missions')
        ->assertJsonPath('missions.0.mission.id', $mission->id)
        ->assertJsonPath('missions.0.mission.billingMode', BillingMode::Daily->value)
        ->assertJsonPath('missions.0.mission.status', MissionStatus::Paused->value)
        ->assertJsonPath('missions.0.mission.startDate', '2026-09-01')
        ->assertJsonPath('missions.0.mission.endDate', '2027-02-26')
        ->assertJsonPath('missions.0.clientName', 'Nordlys');
});

test('orders the missions by client, then by name', function (): void {
    $user = User::factory()->create();
    $vesterhus = Client::factory()->for($user)->create(['name' => 'Vesterhus']);
    $callisto = Client::factory()->for($user)->create(['name' => 'Callisto']);
    foreach ([[$vesterhus, 'Audit'], [$callisto, 'Refonte'], [$callisto, 'Maintenance']] as [$client, $name]) {
        Mission::factory()->for($client, 'client')->create(['user_id' => $user->id, 'name' => $name]);
    }

    $response = $this->actingAs($user)->getJson('/api/missions')->assertOk();

    expect(array_map(
        fn (array $row): string => $row['clientName'].' / '.$row['mission']['name'],
        $response->json('missions'),
    ))->toBe(['Callisto / Maintenance', 'Callisto / Refonte', 'Vesterhus / Audit']);
});

test('carries nothing of the client but its name', function (): void {
    $user = User::factory()->create();
    missionOwnedBy($user);

    expect(array_keys($this->actingAs($user)->getJson('/api/missions')->assertOk()->json('missions.0')))
        ->toBe(['mission', 'clientName']);
});

test('keeps to the account\'s own missions', function (): void {
    $user = User::factory()->create();
    missionOwnedBy(User::factory()->create());

    $this->actingAs($user)
        ->getJson('/api/missions')
        ->assertOk()
        ->assertJsonCount(0, 'missions');
});
