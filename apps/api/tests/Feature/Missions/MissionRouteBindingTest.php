<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Models\Mission;
use App\Domain\Users\Models\User;

test('resolves a mission the authenticated user owns', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create([
        'user_id' => $user->id,
        'name' => 'Callisto front',
    ]);

    $this->actingAs($user);

    expect((new Mission)->resolveRouteBinding($mission->slug))
        ->not->toBeNull()
        ->id->toBe($mission->id);
});

test('refuses to resolve a mission slug owned by another user', function (): void {
    $owner = User::factory()->create();
    $ownerClient = Client::factory()->for($owner)->create();
    Mission::factory()->for($ownerClient, 'client')->create([
        'user_id' => $owner->id,
        'name' => 'Callisto front',
    ]);

    $intruder = User::factory()->create();
    $intruderClient = Client::factory()->for($intruder)->create();
    $own = Mission::factory()->for($intruderClient, 'client')->create([
        'user_id' => $intruder->id,
        'name' => 'Callisto front',
    ]);

    $this->actingAs($intruder);

    expect((new Mission)->resolveRouteBinding('callisto-front'))
        ->not->toBeNull()
        ->id->toBe($own->id);
});

test('resolves nothing when no user is authenticated', function (): void {
    $mission = Mission::factory()->create(['name' => 'Callisto front']);

    expect((new Mission)->resolveRouteBinding($mission->slug))->toBeNull();
});
