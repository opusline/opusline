<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Enums\Color;
use App\Domain\Timers\Data\TimerData;
use App\Domain\Timers\Enums\TimerState;
use App\Domain\Timers\Models\RunningTimer;
use App\Domain\Users\Models\User;

test('maps a running timer to its data shape', function (): void {
    $this->freezeTime();

    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->state([
        'name' => 'Lunaprint maintenance',
        'color' => Color::Olive,
    ]));

    $timer = RunningTimer::factory()->for($mission, 'mission')->create([
        'user_id' => $user->id,
        'note' => 'Filtre agences',
    ]);

    $data = TimerData::from($timer->load('mission.client'));

    expect($data->id)->toBe($timer->id)
        ->and($data->missionId)->toBe($mission->id)
        ->and($data->missionName)->toBe('Lunaprint maintenance')
        ->and($data->missionColor)->toBe(Color::Olive)
        ->and($data->state)->toBe(TimerState::Running)
        ->and($data->elapsedSeconds)->toBe(0)
        ->and($data->note)->toBe('Filtre agences');
});

test('falls back to the client colour when the mission has none', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create(['color' => Color::Plum]);
    $mission = Mission::factory()->for($client, 'client')->create([
        'user_id' => $user->id,
        'color' => null,
    ]);

    $timer = RunningTimer::factory()->for($mission, 'mission')->create(['user_id' => $user->id]);

    expect(TimerData::from($timer->load('mission.client'))->missionColor)->toBe(Color::Plum);
});

test('reports a paused timer as paused', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    $timer = RunningTimer::factory()->for($mission, 'mission')->paused()->create(['user_id' => $user->id]);

    $data = TimerData::from($timer->load('mission.client'));

    expect($data->state)->toBe(TimerState::Paused)
        ->and($data->elapsedSeconds)->toBe(3_600);
});

test('serializes the start time as a timestamp', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    $timer = RunningTimer::factory()->for($mission, 'mission')->create(['user_id' => $user->id]);

    expect(TimerData::from($timer->load('mission.client'))->toArray()['startedAt'])
        ->toBe($timer->started_at->toAtomString());
});
