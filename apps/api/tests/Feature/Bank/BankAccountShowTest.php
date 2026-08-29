<?php

declare(strict_types=1);

use App\Domain\Bank\Enums\BankBalanceSource;
use App\Domain\Bank\Factories\BankMatchFactory;
use App\Domain\Bank\Factories\BankMovementFactory;
use App\Domain\Bank\Factories\BankStatementFactory;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

test('shows an untouched account as empty', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('balance', null)
        ->assertJsonPath('provisions.vat', null)
        ->assertJsonPath('provisions.buffer', null)
        ->assertJsonPath('provisions.urssaf.amount.amount', 0)
        ->assertJsonPath('pendingMatches', [])
        ->assertJsonPath('movements', [])
        ->assertJsonPath('statements', []);
});

test('shows the hand-typed balance as the manual anchor', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update([
        'bank_balance_cents' => 250_000,
        'bank_balance_recorded_on' => '2026-08-11',
    ]);

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('balance.amount.amount', 250_000)
        ->assertJsonPath('balance.source', BankBalanceSource::Manual->value)
        ->assertJsonPath('balance.asOf', '2026-08-11');
});

test('prefers the anchor that speaks about the later date', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update([
        'bank_balance_cents' => 100_000,
        'bank_balance_recorded_on' => '2026-08-01',
    ]);
    bankStatementOwnedBy($user, fn (BankStatementFactory $factory): BankStatementFactory => $factory->withClosingBalance(1_482_000, '2026-08-10'));

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('balance.amount.amount', 1_482_000)
        ->assertJsonPath('balance.source', BankBalanceSource::Statement->value)
        ->assertJsonPath('balance.asOf', '2026-08-10');
});

test('lets the hand-typed figure win a same-day tie', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update([
        'bank_balance_cents' => 999_999,
        'bank_balance_recorded_on' => '2026-08-10',
    ]);
    bankStatementOwnedBy($user, fn (BankStatementFactory $factory): BankStatementFactory => $factory->withClosingBalance(1_482_000, '2026-08-10'));

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('balance.amount.amount', 999_999)
        ->assertJsonPath('balance.source', BankBalanceSource::Manual->value);
});

test('rolls the anchor forward so the tile agrees with the newest movement row', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update([
        'bank_balance_cents' => 100_000,
        'bank_balance_recorded_on' => '2026-08-10',
    ]);
    $statement = bankStatementOwnedBy($user);
    bankMovementFor($user, $statement, fn (BankMovementFactory $factory): BankMovementFactory => $factory->credit(50_000)->on('2026-08-12'));
    bankMovementFor($user, $statement, fn (BankMovementFactory $factory): BankMovementFactory => $factory->debit(20_000)->on('2026-08-08'));

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('balance.amount.amount', 150_000)
        ->assertJsonPath('balance.asOf', '2026-08-10')
        ->assertJsonPath('movements.0.bookedOn', '2026-08-12')
        ->assertJsonPath('movements.0.runningBalance.amount', 150_000)
        ->assertJsonPath('movements.1.runningBalance.amount', 100_000);
});

test('derives the balance from the movements when nothing anchors it', function (): void {
    $user = User::factory()->create();
    $statement = bankStatementOwnedBy($user);
    bankMovementFor($user, $statement, fn (BankMovementFactory $factory): BankMovementFactory => $factory->credit(50_000)->on('2026-08-10'));
    bankMovementFor($user, $statement, fn (BankMovementFactory $factory): BankMovementFactory => $factory->debit(20_000)->on('2026-08-12'));

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('balance.amount.amount', 30_000)
        ->assertJsonPath('balance.source', BankBalanceSource::Derived->value)
        ->assertJsonPath('balance.asOf', null)
        ->assertJsonPath('movements.0.runningBalance.amount', 30_000)
        ->assertJsonPath('movements.1.runningBalance.amount', 50_000);
});

test('lets a typed balance correct the derived one', function (): void {
    $user = User::factory()->create();
    bankMovementFor($user, configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->credit(50_000)->on('2026-08-10'));

    $this->actingAs($user)
        ->putJson('/api/bank/balance', ['balance' => ['amount' => 741_000, 'currency' => 'EUR']])
        ->assertOk()
        ->assertJsonPath('balance.amount.amount', 741_000)
        ->assertJsonPath('balance.source', BankBalanceSource::Manual->value);
});

test('lists pending suggestions with their movement and invoice', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent());
    $movement = bankMovementFor($user, configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->credit(198_000)->on('2026-08-08'));
    $match = bankMatchFor($user, $invoice, $movement);

    bankMatchFor($user, configure: fn (BankMatchFactory $factory): BankMatchFactory => $factory->dismissed());

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonCount(1, 'pendingMatches')
        ->assertJsonPath('pendingMatches.0.id', $match->id)
        ->assertJsonPath('pendingMatches.0.bookedOn', '2026-08-08')
        ->assertJsonPath('pendingMatches.0.amount.amount', 198_000)
        ->assertJsonPath('pendingMatches.0.invoice.id', $invoice->id)
        ->assertJsonPath('pendingMatches.0.invoice.clientName', $invoice->client->name)
        ->assertJsonPath('movements.1.pendingMatchId', $match->id);
});

test('counts each statement\'s suggestions and validated ones', function (): void {
    $user = User::factory()->create();
    $statement = bankStatementOwnedBy($user);

    bankMatchFor($user, movement: bankMovementFor($user, $statement));
    bankMatchFor($user, movement: bankMovementFor($user, $statement), configure: fn (BankMatchFactory $factory): BankMatchFactory => $factory->validated());
    bankMatchFor($user, movement: bankMovementFor($user, $statement), configure: fn (BankMatchFactory $factory): BankMatchFactory => $factory->dismissed());

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('statements.0.id', $statement->id)
        ->assertJsonPath('statements.0.matchCount', 3)
        ->assertJsonPath('statements.0.validatedMatchCount', 1);
});

test('shows the invoice a validated movement was linked to', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->paid()->state(['number' => '2026-040']));
    bankMovementFor($user, configure: fn (BankMovementFactory $factory) => $factory->state(['invoice_id' => $invoice->id]));

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('movements.0.invoice.number', '2026-040')
        ->assertJsonPath('movements.0.pendingMatchId', null);
});

test('nulls the urssaf provision outside french fiscality', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['business_country' => 'DE']);

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('provisions.urssaf', null)
        ->assertJsonPath('provisions.total.amount', 0);
});

test('never leaks another account\'s rows', function (): void {
    $user = User::factory()->create();
    $other = User::factory()->create();
    bankMovementFor($other);
    bankMatchFor($other);

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('movements', [])
        ->assertJsonPath('pendingMatches', [])
        ->assertJsonPath('statements', []);
});

test('flags a credit nobody linked, wherever it sits in the history', function (): void {
    $user = User::factory()->create();
    bankMovementFor($user, configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->credit(50_000)->on('2026-08-10'));

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('hasUnlinkedCredits', true);
});

test('reports all clear when every credit is linked or suggested', function (): void {
    $user = User::factory()->create();
    $statement = bankStatementOwnedBy($user);
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent());
    $linked = bankMovementFor($user, $statement, fn (BankMovementFactory $factory): BankMovementFactory => $factory->credit(50_000)->on('2026-08-10'));
    $linked->update(['invoice_id' => $invoice->id]);
    $suggested = bankMovementFor($user, $statement, fn (BankMovementFactory $factory): BankMovementFactory => $factory->credit(30_000)->on('2026-08-11'));
    bankMatchFor($user, movement: $suggested);
    bankMovementFor($user, $statement, fn (BankMovementFactory $factory): BankMovementFactory => $factory->debit(20_000)->on('2026-08-12'));

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('hasUnlinkedCredits', false);
});

test('requires authentication', function (): void {
    $this->getJson('/api/bank')->assertUnauthorized();
});
