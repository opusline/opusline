<?php

declare(strict_types=1);

use App\Domain\Missions\Data\MissionData;
use App\Domain\Missions\Models\Mission;

test('maps a mission model to mission data', function (): void {
    $mission = Mission::factory()->create([
        'name' => 'OGF front',
        'rate_cents' => 55_000,
        'start_date' => '2026-08-01',
    ]);

    $data = MissionData::fromModel($mission->load(['client', 'endClient']));

    expect($data->id)->toBe($mission->id)
        ->and($data->clientSlug)->toBe($mission->client->slug)
        ->and($data->name)->toBe('OGF front')
        ->and($data->rate?->amount)->toBe(55_000)
        ->and($data->rate?->currency)->toBe('EUR')
        ->and($data->startDate?->toDateString())->toBe('2026-08-01')
        ->and($data->endDate)->toBeNull();
});

test('maps a non billable mission with a null rate', function (): void {
    $mission = Mission::factory()->nonBillable()->create();

    $data = MissionData::fromModel($mission->load(['client', 'endClient']));

    expect($data->rate)->toBeNull();
});
