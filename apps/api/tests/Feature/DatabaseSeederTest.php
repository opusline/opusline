<?php

declare(strict_types=1);

use App\Domain\Cra\Actions\DescribeCra;
use App\Domain\Cra\Calendar\FrenchHolidays;
use App\Domain\Cra\Enums\CraStatus;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

test('seeds a demo portfolio for the test user', function (): void {
    $this->seed();

    $user = User::query()->where('email', 'test@example.com')->firstOrFail();

    expect($user->clients)->toHaveCount(5)
        ->and($user->missions)->toHaveCount(4)
        ->and($user->timeEntries)->not->toBeEmpty()
        ->and($user->clients->every(fn ($client): bool => $client->slug !== ''))->toBeTrue();
});

test('seeds a sent CRA so the comptes rendus screen has both piles', function (): void {
    $this->seed();

    $user = User::query()->where('email', 'test@example.com')->firstOrFail();
    $cra = $user->cras()->with(['days', 'mission'])->firstOrFail();

    $holidays = FrenchHolidays::between($cra->month->startOfMonth(), $cra->month->endOfMonth());

    expect($cra->status)->toBe(CraStatus::Sent)
        ->and($cra->mission->name)->toBe('Callisto front')
        ->and($cra->month->toDateString())->toBe(CarbonImmutable::today()->subMonth()->startOfMonth()->toDateString())
        ->and($cra->days)->not->toBeEmpty()
        ->and($cra->days->every(
            fn ($day): bool => ! $day->date->isWeekend(),
        ))->toBeTrue()
        ->and($cra->days->every(
            fn ($day): bool => ! isset($holidays[$day->date->toDateString()]),
        ))->toBeTrue()
        // The two seeders write to the same mission, and the recent-entries walk must
        // stop at the month boundary — otherwise it double-books days the CRA already
        // reports and the demo account opens on a CRA that contradicts its own tracked
        // time.
        ->and(app(DescribeCra::class)->handle($cra)->differenceDays)->toBe(0.0);
});

test('seeds a running timer so the topbar chip has something to render', function (): void {
    $this->seed();

    $user = User::query()->where('email', 'test@example.com')->firstOrFail();
    $timer = $user->runningTimer()->with('mission')->firstOrFail();

    expect($timer->isPaused())->toBeFalse()
        ->and($timer->elapsedSeconds())->toBeGreaterThanOrEqual(7_000)
        ->and($timer->mission->name)->toBe('Lunaprint maintenance');
});

test('seeds time on a non-billable mission so the week grid shows one', function (): void {
    $this->seed();

    $user = User::query()->where('email', 'test@example.com')->firstOrFail();
    $nonBillable = $user->missions()
        ->whereNull('rate_cents')
        ->with('timeEntries')
        ->firstOrFail();

    expect($nonBillable->timeEntries)->not->toBeEmpty()
        ->and($nonBillable->timeEntries->every(
            fn ($entry): bool => $entry->note !== null,
        ))->toBeTrue()
        ->and($nonBillable->timeEntries->every(
            fn ($entry): bool => $entry->billable === false,
        ))->toBeTrue();
});
