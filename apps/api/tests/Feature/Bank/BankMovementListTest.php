<?php

declare(strict_types=1);

use App\Domain\Bank\Actions\ListBankMovements;
use App\Domain\Bank\Models\BankMovement;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\Sequence;

beforeEach(fn () => freezeTodayAtUtcNoon());

/**
 * A page-and-a-bit of daily 1 000-cent credits ending 2026-08-12, under a
 * hand-typed anchor that covers them all — so every expected running balance
 * is arithmetic on the row's position.
 */
function accountWithPagedMovements(int $count = 203, int $anchorCents = 1_000_000): User
{
    $user = User::factory()->create();
    $user->settings()->sole()->update([
        'bank_balance_cents' => $anchorCents,
        'bank_balance_recorded_on' => '2026-08-13',
    ]);

    $statement = bankStatementOwnedBy($user);

    BankMovement::factory()
        ->count($count)
        ->for($statement, 'statement')
        ->sequence(fn (Sequence $sequence): array => [
            'booked_on' => CarbonImmutable::parse('2026-08-12')->subDays($sequence->index)->toDateString(),
        ])
        ->create(['user_id' => $user->id, 'amount_cents' => 1_000]);

    return $user;
}

test('the summary windows the movements and hands out a cursor', function (): void {
    $user = accountWithPagedMovements();

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonCount(ListBankMovements::PAGE_SIZE, 'movements')
        ->assertJsonPath('movements.0.bookedOn', '2026-08-12')
        ->assertJsonPath('movements.0.runningBalance.amount', 1_000_000)
        ->assertJsonPath('movements.199.runningBalance.amount', 801_000)
        ->assertJsonPath('balance.amount.amount', 1_000_000)
        ->assertJson(fn ($json) => $json->whereType('nextMovementsCursor', 'string')->etc());
});

test('a deeper page continues the running balance where the window stopped', function (): void {
    $user = accountWithPagedMovements();

    $cursor = $this->actingAs($user)->getJson('/api/bank')->json('nextMovementsCursor');

    $this->actingAs($user)
        ->getJson('/api/bank/movements?cursor='.urlencode((string) $cursor))
        ->assertOk()
        ->assertJsonCount(3, 'movements')
        ->assertJsonPath('movements.0.runningBalance.amount', 800_000)
        ->assertJsonPath('movements.2.runningBalance.amount', 798_000)
        ->assertJsonPath('nextCursor', null);
});

test('serves the newest page when no cursor is given', function (): void {
    $user = accountWithPagedMovements(count: 3);

    $this->actingAs($user)
        ->getJson('/api/bank/movements')
        ->assertOk()
        ->assertJsonCount(3, 'movements')
        ->assertJsonPath('movements.0.bookedOn', '2026-08-12')
        ->assertJsonPath('movements.0.runningBalance.amount', 1_000_000)
        ->assertJsonPath('nextCursor', null);
});

test('treats an undecodable cursor as the newest page', function (): void {
    $user = accountWithPagedMovements(count: 2);

    $this->actingAs($user)
        ->getJson('/api/bank/movements?cursor=not-a-cursor')
        ->assertOk()
        ->assertJsonCount(2, 'movements');
});

test('never leaks another account\'s rows', function (): void {
    $user = User::factory()->create();
    bankMovementFor(User::factory()->create());

    $this->actingAs($user)
        ->getJson('/api/bank/movements')
        ->assertOk()
        ->assertJsonPath('movements', [])
        ->assertJsonPath('nextCursor', null);
});

test('requires authentication', function (): void {
    $this->getJson('/api/bank/movements')->assertUnauthorized();
});
