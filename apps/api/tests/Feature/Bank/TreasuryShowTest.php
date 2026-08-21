<?php

declare(strict_types=1);

use App\Domain\Bank\Factories\BankMovementFactory;
use App\Domain\Bank\Factories\BankStatementFactory;
use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

/**
 * The account the design canvas is drawn from: 10 450 € HT collected in August
 * at 20 % TVA, 26 % of contributions, a 1 500 € matelas, 14 820 € on the
 * account — so 8 513 € are the user's.
 */
function canvasAccount(): User
{
    $user = User::factory()->create();

    $user->settings()->sole()->update([
        'vat_regime' => VatRegime::ReelNormal,
        'contribution_rate_bp' => 2600,
        'currency' => 'EUR',
        'treasury_buffer_cents' => 150_000,
        'bank_balance_cents' => 1_482_000,
        'bank_balance_recorded_on' => '2026-08-12',
    ]);

    paidInvoiceOn($user, '2026-08-03', htCents: 1_045_000, ttcCents: 1_254_000);

    return $user;
}

test('shows nothing to transfer until a balance is known', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson('/api/treasury')
        ->assertOk()
        ->assertJsonPath('balance', null)
        ->assertJsonPath('transferable', null)
        ->assertJsonPath('coveredThrough', null)
        ->assertJsonPath('pendingTransfers.amount', 0)
        ->assertJsonPath('transfers', []);
});

test('subtracts the provisions from the balance to answer what is transferable', function (): void {
    $this->actingAs(canvasAccount())
        ->getJson('/api/treasury')
        ->assertOk()
        ->assertJsonPath('balance.amount.amount', 1_482_000)
        ->assertJsonPath('provisions.vat.amount.amount', 209_000)
        ->assertJsonPath('provisions.urssaf.amount.amount', 271_700)
        ->assertJsonPath('provisions.urssaf.rateBp', 2600)
        ->assertJsonPath('provisions.buffer.amount', 150_000)
        ->assertJsonPath('provisions.total.amount', 630_700)
        ->assertJsonPath('transferable.amount', 851_300);
});

test('dates each provision to the period it accrued over', function (): void {
    $this->actingAs(canvasAccount())
        ->getJson('/api/treasury')
        ->assertOk()
        ->assertJsonPath('provisions.vat.periodEnd', '2026-08-31')
        ->assertJsonPath('provisions.urssaf.periodEnd', '2026-08-31');
});

test('reports a negative transferable amount when the provisions outgrow the account', function (): void {
    $user = canvasAccount();
    $user->settings()->sole()->update(['bank_balance_cents' => 20_000]);

    $this->actingAs($user)
        ->getJson('/api/treasury')
        ->assertOk()
        ->assertJsonPath('transferable.amount', -610_700);
});

test('answers with the same balance the compte pro screen shows', function (): void {
    $user = canvasAccount();
    bankMovementFor($user, configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->credit(300_000)->on('2026-08-13'));

    $bank = $this->actingAs($user)->getJson('/api/bank')->assertOk();

    $this->actingAs($user)
        ->getJson('/api/treasury')
        ->assertOk()
        ->assertJsonPath('balance.amount.amount', $bank->json('balance.amount.amount'))
        ->assertJsonPath('balance.source', $bank->json('balance.source'))
        ->assertJsonPath('balance.asOf', $bank->json('balance.asOf'));
});

test('covers the balance through the later of the anchor date and the last movement', function (): void {
    $user = canvasAccount();
    bankMovementFor($user, configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->debit(10_000)->on('2026-08-13'));

    $this->actingAs($user)
        ->getJson('/api/treasury')
        ->assertOk()
        ->assertJsonPath('coveredThrough', '2026-08-13');
});

test('ignores a movement dated in the future when deciding what the balance covers', function (): void {
    $user = canvasAccount();
    bankMovementFor($user, configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->debit(10_000)->on('2026-09-30'));

    $this->actingAs($user)
        ->getJson('/api/treasury')
        ->assertOk()
        ->assertJsonPath('coveredThrough', '2026-08-13');
});

test('cites the statement its closing balance was read from', function (): void {
    $user = canvasAccount();
    bankStatementOwnedBy($user, fn (BankStatementFactory $factory): BankStatementFactory => $factory->withClosingBalance(900_000, '2026-08-13'));

    $this->actingAs($user)
        ->getJson('/api/treasury')
        ->assertOk()
        ->assertJsonPath('balance.amount.amount', 900_000)
        ->assertJsonPath('balance.source', 1)
        ->assertJsonPath('coveredThrough', '2026-08-13');
});

test('drops the tva provision under franchise en base', function (): void {
    $user = canvasAccount();
    $user->settings()->sole()->update(['vat_regime' => VatRegime::FranchiseEnBase]);

    $this->actingAs($user)
        ->getJson('/api/treasury')
        ->assertOk()
        ->assertJsonPath('provisions.vat', null)
        ->assertJsonPath('provisions.total.amount', 421_700)
        ->assertJsonPath('transferable.amount', 1_060_300);
});

test('drops the urssaf provision for an account established outside France', function (): void {
    $user = canvasAccount();
    $user->settings()->sole()->update(['business_country' => 'DE']);

    $this->actingAs($user)
        ->getJson('/api/treasury')
        ->assertOk()
        ->assertJsonPath('provisions.urssaf', null)
        ->assertJsonPath('provisions.total.amount', 359_000)
        ->assertJsonPath('transferable.amount', 1_123_000);
});

test('a signed-out visitor is turned away', function (): void {
    $this->getJson('/api/treasury')->assertUnauthorized();
});

test('another account sees its own treasury, never this one', function (): void {
    canvasAccount();
    $stranger = User::factory()->create();

    $this->actingAs($stranger)
        ->getJson('/api/treasury')
        ->assertOk()
        ->assertJsonPath('balance', null)
        ->assertJsonPath('transferable', null);
});

/**
 * The web relies on this: the page renders its hero — and the route mounts the
 * record dialog — on the strength of one of these two fields standing in for
 * the other.
 */
test('cites a covered-through date exactly when it knows a balance', function (): void {
    $blank = $this->actingAs(User::factory()->create())->getJson('/api/treasury')->assertOk();

    expect($blank->json('balance'))->toBeNull()
        ->and($blank->json('coveredThrough'))->toBeNull();

    $known = $this->actingAs(canvasAccount())->getJson('/api/treasury')->assertOk();

    expect($known->json('balance'))->not->toBeNull()
        ->and($known->json('coveredThrough'))->not->toBeNull();
});
