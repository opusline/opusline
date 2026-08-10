<?php

declare(strict_types=1);

use App\Domain\Timers\Enums\TimerState;
use App\Domain\Timers\Models\RunningTimer;
use Carbon\CarbonImmutable;

/**
 * Pure arithmetic against an explicit clock — no database, no time travel.
 */
function timerBanking(int $accumulatedSeconds, ?CarbonImmutable $runningSince): RunningTimer
{
    $timer = new RunningTimer;
    $timer->accumulated_seconds = $accumulatedSeconds;
    $timer->running_since = $runningSince;

    return $timer;
}

test('a running timer adds the segment in flight to the banked total', function (): void {
    $startedAt = CarbonImmutable::parse('2026-08-03 09:00:00');
    $timer = timerBanking(600, $startedAt);

    expect($timer->elapsedSeconds($startedAt->addSeconds(90)))->toBe(690)
        ->and($timer->state())->toBe(TimerState::Running)
        ->and($timer->isPaused())->toBeFalse();
});

test('a paused timer reports only what it banked', function (): void {
    $timer = timerBanking(600, null);

    expect($timer->elapsedSeconds(CarbonImmutable::parse('2026-08-03 18:00:00')))->toBe(600)
        ->and($timer->state())->toBe(TimerState::Paused)
        ->and($timer->isPaused())->toBeTrue();
});

test('a clock that jumped backwards cannot subtract from the banked total', function (): void {
    $startedAt = CarbonImmutable::parse('2026-08-03 09:00:00');
    $timer = timerBanking(600, $startedAt);

    expect($timer->elapsedSeconds($startedAt->subMinutes(5)))->toBe(600);
});

test('a fresh timer starts from zero', function (): void {
    $startedAt = CarbonImmutable::parse('2026-08-03 09:00:00');

    expect(timerBanking(0, $startedAt)->elapsedSeconds($startedAt))->toBe(0);
});
