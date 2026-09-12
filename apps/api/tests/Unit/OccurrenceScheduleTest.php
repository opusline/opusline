<?php

declare(strict_types=1);

use App\Domain\Expenses\Enums\SubscriptionPeriodicity;
use App\Domain\Expenses\Models\Subscription;
use App\Domain\Expenses\Subscriptions\OccurrenceSchedule;
use Carbon\CarbonImmutable;

/**
 * @param  array<string, mixed>  $attributes
 */
function schedule(array $attributes): OccurrenceSchedule
{
    return new OccurrenceSchedule(new Subscription([
        'periodicity' => SubscriptionPeriodicity::Monthly,
        'debit_day' => 5,
        'debit_month' => null,
        'started_on' => CarbonImmutable::parse('2026-01-05'),
        'cancelled_on' => null,
        'is_paused' => false,
        ...$attributes,
    ]));
}

/**
 * @return list<string>
 */
function debitDates(OccurrenceSchedule $schedule, string $from, string $to): array
{
    return array_map(
        static fn (CarbonImmutable $date): string => $date->toDateString(),
        $schedule->debitsBetween(CarbonImmutable::parse($from), CarbonImmutable::parse($to)),
    );
}

test('lists the debits of a window', function (array $attributes, string $from, string $to, array $expected): void {
    expect(debitDates(schedule($attributes), $from, $to))->toBe($expected);
})->with([
    'a monthly one on its day, clamped to the month' => [['debit_day' => 31, 'started_on' => CarbonImmutable::parse('2026-01-31')], '2026-01-01', '2026-04-30', ['2026-01-31', '2026-02-28', '2026-03-31', '2026-04-30']],
    'the first debit on or after the start' => [['started_on' => CarbonImmutable::parse('2026-01-20')], '2026-01-01', '2026-03-31', ['2026-02-05', '2026-03-05']],
    'a quarterly one stepping from its first debit' => [['periodicity' => SubscriptionPeriodicity::Quarterly, 'started_on' => CarbonImmutable::parse('2026-02-05')], '2026-01-01', '2026-12-31', ['2026-02-05', '2026-05-05', '2026-08-05', '2026-11-05']],
    'a quarterly one started after its day debits the next month first' => [['periodicity' => SubscriptionPeriodicity::Quarterly, 'started_on' => CarbonImmutable::parse('2026-02-20')], '2026-01-01', '2026-12-31', ['2026-03-05', '2026-06-05', '2026-09-05', '2026-12-05']],
    'an annual one on its own day and month' => [['periodicity' => SubscriptionPeriodicity::Annual, 'debit_day' => 15, 'debit_month' => 3, 'started_on' => CarbonImmutable::parse('2025-06-01')], '2025-01-01', '2027-12-31', ['2026-03-15', '2027-03-15']],
    'stopping at the cancellation' => [['cancelled_on' => CarbonImmutable::parse('2026-03-05')], '2026-01-01', '2026-06-30', ['2026-01-05', '2026-02-05', '2026-03-05']],
    'nothing when cancelled before it started' => [['cancelled_on' => CarbonImmutable::parse('2025-12-01')], '2026-01-01', '2026-06-30', []],
]);

test('names the period the way the expense it becomes will', function (SubscriptionPeriodicity $periodicity, string $key): void {
    expect($periodicity->periodKey(CarbonImmutable::parse('2026-08-05')))->toBe($key);
})->with([
    'monthly' => [SubscriptionPeriodicity::Monthly, '2026-08'],
    'quarterly' => [SubscriptionPeriodicity::Quarterly, '2026-Q3'],
    'annual' => [SubscriptionPeriodicity::Annual, '2026'],
]);

test('the next debit is the first one after today', function (array $attributes, ?string $expected): void {
    expect(schedule($attributes)->nextDebitOn(CarbonImmutable::parse('2026-08-13'))?->toDateString())->toBe($expected);
})->with([
    'later this month is over, so next month' => [[], '2026-09-05'],
    'today itself is over too' => [['debit_day' => 13], '2026-09-13'],
    'none while paused' => [['is_paused' => true], null],
    'none once cancelled' => [['cancelled_on' => CarbonImmutable::parse('2026-08-05')], null],
    'still one before a cancellation dated ahead' => [['cancelled_on' => CarbonImmutable::parse('2026-09-30')], '2026-09-05'],
    'none past a cancellation dated ahead' => [['cancelled_on' => CarbonImmutable::parse('2026-09-01')], null],
]);

test('the day of each month between two dates, clamped like a debit day', function (): void {
    $days = OccurrenceSchedule::dayOfEachMonthBetween(31, CarbonImmutable::parse('2026-01-15'), CarbonImmutable::parse('2026-03-31'));

    expect(array_map(static fn (CarbonImmutable $day): string => $day->toDateString(), $days))
        ->toBe(['2026-01-31', '2026-02-28', '2026-03-31']);
});
