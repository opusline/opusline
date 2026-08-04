<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Models\Mission;
use App\Domain\Users\Models\User;

test('generates the slug from the name', function (): void {
    $mission = Mission::factory()->create(['name' => 'Callisto front']);

    expect($mission->slug)->toBe('callisto-front');
});

test('suffixes the slug when the name is already taken by the same user', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $first = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id, 'name' => 'Callisto front']);
    $second = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id, 'name' => 'Callisto front']);

    expect($first->slug)->toBe('callisto-front')
        ->and($second->slug)->toBe('callisto-front-1');
});

test('reuses the same slug across different users', function (): void {
    $first = Mission::factory()->create(['name' => 'Callisto front']);
    $second = Mission::factory()->create(['name' => 'Callisto front']);

    expect($first->slug)->toBe('callisto-front')
        ->and($second->slug)->toBe('callisto-front');
});

test('keeps the slug when the mission is renamed', function (): void {
    $mission = Mission::factory()->create(['name' => 'Callisto front']);

    $mission->update(['name' => 'Renamed mission']);

    expect($mission->refresh()->slug)->toBe('callisto-front');
});
