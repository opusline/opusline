<?php

declare(strict_types=1);

use App\Domain\Expenses\Models\Subscription;
use App\Domain\Expenses\Models\SubscriptionAmount;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Collection;

/**
 * @param  list<array{0: string, 1: int}>  $rows  [effective from, HT cents], oldest first
 */
function pricedSubscription(array $rows): Subscription
{
    return new Subscription()->setRelation('amounts', new Collection(array_map(
        static fn (array $row): SubscriptionAmount => new SubscriptionAmount([
            'effective_from' => CarbonImmutable::parse($row[0]),
            'currency' => 'EUR',
            'amount_ht_cents' => $row[1],
        ]),
        $rows,
    )));
}

test('the price in force is the latest one dated on or before the day', function (string $date, int $htCents): void {
    $subscription = pricedSubscription([['2026-01-05', 2_400], ['2026-04-01', 2_900], ['2026-10-01', 3_100]]);

    expect((int) $subscription->priceOn(CarbonImmutable::parse($date))->getAmount())->toBe($htCents);
})->with([
    'before any change' => ['2026-02-05', 2_400],
    'the day a change applies' => ['2026-04-01', 2_900],
    'between two changes' => ['2026-07-05', 2_900],
    'before the opening price, which still reads' => ['2025-12-05', 2_400],
    'after a change dated in the future' => ['2026-12-05', 3_100],
]);

test('a subscription without any price is a bug, not a zero', function (): void {
    pricedSubscription([])->priceOn(CarbonImmutable::parse('2026-01-05'));
})->throws(InvalidArgumentException::class);
