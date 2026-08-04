<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Models\Mission;
use App\Domain\Users\Models\User;

test('generates the slug from the name', function (): void {
    $mission = Mission::factory()->create(['name' => 'OGF front']);

    expect($mission->slug)->toBe('ogf-front');
});

test('suffixes the slug when the name is already taken by the same user', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $first = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id, 'name' => 'OGF front']);
    $second = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id, 'name' => 'OGF front']);

    expect($first->slug)->toBe('ogf-front')
        ->and($second->slug)->toBe('ogf-front-1');
});

test('reuses the same slug across different users', function (): void {
    $first = Mission::factory()->create(['name' => 'OGF front']);
    $second = Mission::factory()->create(['name' => 'OGF front']);

    expect($first->slug)->toBe('ogf-front')
        ->and($second->slug)->toBe('ogf-front');
});

test('keeps the slug when the mission is renamed', function (): void {
    $mission = Mission::factory()->create(['name' => 'OGF front']);

    $mission->update(['name' => 'Renamed mission']);

    expect($mission->refresh()->slug)->toBe('ogf-front');
});
