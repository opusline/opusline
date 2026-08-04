<?php

declare(strict_types=1);

use App\Domain\Missions\Data\MissionData;
use App\Domain\Missions\Enums\EntryRounding;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Enums\Currency;

test('maps a mission model to mission data', function (): void {
    $mission = Mission::factory()->create([
        'name' => 'OGF front',
        'rate_cents' => 55_000,
        'start_date' => '2026-08-01',
    ]);

    $data = MissionData::from($mission);

    expect($data->id)->toBe($mission->id)
        ->and($data->slug)->toBe('ogf-front')
        ->and($data->clientId)->toBe($mission->client_id)
        ->and($data->name)->toBe('OGF front')
        ->and($data->endClientName)->toBeNull()
        ->and($data->rate?->amount)->toBe(55_000)
        ->and($data->rate?->currency)->toBe(Currency::EUR)
        ->and($data->rounding)->toBe(EntryRounding::Half)
        ->and($data->craRequired)->toBeFalse()
        ->and($data->color)->toBeNull()
        ->and($data->notes)->toBeNull()
        ->and($data->startDate?->toDateString())->toBe('2026-08-01')
        ->and($data->endDate)->toBeNull();
});

test('maps a non billable mission with a null rate', function (): void {
    $mission = Mission::factory()->nonBillable()->create();

    $data = MissionData::from($mission);

    expect($data->rate)->toBeNull();
});
