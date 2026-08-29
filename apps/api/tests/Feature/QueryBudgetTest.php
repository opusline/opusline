<?php

declare(strict_types=1);

use App\Domain\Bank\Factories\BankMovementFactory;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

beforeEach(fn () => freezeTodayAtUtcNoon());

/**
 * The number of queries an endpoint runs must not scale with the number of
 * rows an account has accumulated — these are the endpoints where it once did.
 * The fixtures are deliberately bigger than the ceilings: a per-row regression
 * (an N+1, or a hydrate-everything rewrite) blows past them immediately, while
 * an honest new feature costing a couple of fixed queries only nudges them.
 */
function queriesDuring(callable $request): int
{
    $count = 0;

    DB::listen(function () use (&$count): void {
        $count++;
    });

    $request();

    return $count;
}

/** Thirty movements across July — enough for any per-row regression to blow a ceiling. */
function accountWithThirtyMovements(User $user, string $kind): void
{
    $statement = bankStatementOwnedBy($user);

    foreach (range(1, 30) as $day) {
        bankMovementFor($user, $statement, fn (BankMovementFactory $factory): BankMovementFactory => $factory
            ->{$kind}(1_000)
            ->on('2026-07-'.str_pad((string) ($day % 28 + 1), 2, '0', STR_PAD_LEFT)));
    }
}

test('the bank summary runs a bounded number of queries', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update([
        'bank_balance_cents' => 1_000_000,
        'bank_balance_recorded_on' => '2026-08-13',
    ]);
    accountWithThirtyMovements($user, 'credit');

    $queries = queriesDuring(fn () => test()->actingAs($user)->getJson('/api/bank')->assertOk());

    expect($queries)->toBeLessThanOrEqual(20);
});

test('the bank movements page runs a bounded number of queries', function (): void {
    $user = User::factory()->create();
    accountWithThirtyMovements($user, 'credit');

    $queries = queriesDuring(fn () => test()->actingAs($user)->getJson('/api/bank/movements')->assertOk());

    expect($queries)->toBeLessThanOrEqual(12);
});

test('the treasury summary runs a bounded number of queries', function (): void {
    $user = User::factory()->create();
    accountWithThirtyMovements($user, 'debit');

    $queries = queriesDuring(fn () => test()->actingAs($user)->getJson('/api/treasury')->assertOk());

    expect($queries)->toBeLessThanOrEqual(20);
});

test('a calendar feed poll answered with 304 runs a bounded number of queries', function (): void {
    $user = User::factory()->create();
    accountWithThirtyMovements($user, 'debit');
    $token = test()->actingAs($user)->getJson('/api/deadlines')->json('calendarToken');
    $url = "/api/calendar/{$token}.ics";
    $etag = test()->get($url)->assertOk()->headers->get('ETag');

    $queries = queriesDuring(fn () => test()->get($url, ['If-None-Match' => $etag])->assertStatus(304));

    expect($queries)->toBeLessThanOrEqual(6);
});

test('the invoice summary runs a bounded number of queries', function (): void {
    $user = User::factory()->create();

    foreach (range(1, 15) as $ignored) {
        invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent());
    }

    $queries = queriesDuring(fn () => test()->actingAs($user)->getJson('/api/invoices/summary')->assertOk());

    expect($queries)->toBeLessThanOrEqual(20);
});

test('the cra detail runs a bounded number of queries', function (): void {
    $user = User::factory()->create();
    $cra = craOwnedBy($user);

    $cra->days()->insert(array_map(static fn (int $day): array => [
        'cra_id' => $cra->id,
        'date' => $cra->month->addDays($day - 1)->toDateString(),
        'day_fraction_bp' => 10_000,
    ], range(1, 20)));

    $queries = queriesDuring(fn () => test()->actingAs($user)->getJson("/api/cras/{$cra->id}")->assertOk());

    expect($queries)->toBeLessThanOrEqual(15);
});
