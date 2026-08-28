<?php

declare(strict_types=1);

use App\Domain\Deadlines\Enums\DeadlineItemType;
use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Invoices\Factories\InvoiceFactory;
use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Users\Models\User;
use Illuminate\Support\Collection;

beforeEach(fn () => freezeTodayAtUtcNoon());

/** @return Collection<int, array<string, mixed>> */
function boardItems(User $user): Collection
{
    return collect(test()->actingAs($user)->getJson('/api/deadlines')->assertOk()->json('items'));
}

/** @return Collection<int, array<string, mixed>> */
function fiscalItems(User $user): Collection
{
    return boardItems($user)
        ->where('type', DeadlineItemType::Fiscal->value)
        ->pluck('fiscal');
}

function openInvoiceDueOn(User $user, string $dueOn, int $ttcCents = 198_000): void
{
    invoiceOwnedBy($user, configure: fn (InvoiceFactory $factory): InvoiceFactory => $factory->sent()->state([
        'issued_on' => '2026-01-05',
        'due_on' => $dueOn,
        'currency' => 'EUR',
        'amount_ht_cents' => 165_000,
        'amount_ttc_cents' => $ttcCents,
    ]));
}

test('lists the fiscal calendar the account profile produces', function (): void {
    $user = User::factory()->create();

    $kinds = fiscalItems($user)->pluck('kind')->unique()->sort()->values()->all();

    // A default account is under the franchise en base: URSSAF every month,
    // and the statutory December CFE — amount or not.
    expect($kinds)->toBe([
        FiscalDeadlineKind::UrssafDeclaration->value,
        FiscalDeadlineKind::Cfe->value,
    ]);
});

test('points at what is still owed, oldest first, so a late one leads', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson('/api/deadlines')
        ->assertOk()
        ->assertJsonPath('next.type', DeadlineItemType::Fiscal->value)
        ->assertJsonPath('next.fiscal.periodKey', '2026-05')
        ->assertJsonPath('next.dueOn', '2026-06-30');
});

test('an open invoice takes its place on the timeline at its due date', function (): void {
    $user = User::factory()->create();
    openInvoiceDueOn($user, '2026-09-04');

    $item = boardItems($user)->firstWhere('type', DeadlineItemType::InvoiceDue->value);

    expect($item['dueOn'])->toBe('2026-09-04')
        ->and($item['invoice']['amount']['amount'])->toBe(198_000)
        ->and($item['invoice']['clientName'])->not->toBeNull()
        ->and($item['fiscal'])->toBeNull();
});

test('a late invoice also calls for its relance, right underneath', function (): void {
    $user = User::factory()->create();
    openInvoiceDueOn($user, '2026-07-20');

    $items = boardItems($user)->values();
    $dueIndex = $items->search(fn (array $item): bool => $item['type'] === DeadlineItemType::InvoiceDue->value);
    $reminderIndex = $items->search(fn (array $item): bool => $item['type'] === DeadlineItemType::InvoiceReminder->value);

    expect($dueIndex)->not->toBeFalse()
        ->and($reminderIndex)->toBe($dueIndex + 1)
        ->and($items[$reminderIndex]['invoice']['remindersSent'])->toBe(0)
        ->and($items[$reminderIndex]['dueOn'])->toBe('2026-07-20');
});

test('an invoice not yet due asks for no relance', function (): void {
    $user = User::factory()->create();
    openInvoiceDueOn($user, '2026-09-04');

    expect(boardItems($user)->where('type', DeadlineItemType::InvoiceReminder->value))->toHaveLength(0);
});

test('a paid invoice carries no line at all', function (): void {
    $user = User::factory()->create();
    paidInvoiceOn($user, '2026-07-10');

    expect(boardItems($user)->whereNotNull('invoice'))->toHaveLength(0);
});

test('a late open invoice leads the board over the fisc', function (): void {
    $user = User::factory()->create();
    openInvoiceDueOn($user, '2026-03-16');

    $this->actingAs($user)
        ->getJson('/api/deadlines')
        ->assertOk()
        ->assertJsonPath('next.type', DeadlineItemType::InvoiceDue->value)
        ->assertJsonPath('next.dueOn', '2026-03-16');
});

test('estimates URSSAF from what the period actually collected', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update([
        'contribution_rate_bp' => 2500,
        'liberating_payment' => false,
        'liberating_payment_rate_bp' => 0,
    ]);

    paidInvoiceOn($user, '2026-07-10');
    paidInvoiceOn($user, '2026-07-28');

    $july = fiscalItems($user->fresh())
        ->firstWhere(fn (array $deadline): bool => $deadline['kind'] === FiscalDeadlineKind::UrssafDeclaration->value
            && $deadline['periodKey'] === '2026-07');

    // paidInvoiceOn bills 1 650 € HT each; a closed period is summed whole.
    expect($july['amount']['amount'])->toBe(82_500)
        ->and($july['rateBp'])->toBe(2500)
        ->and($july['isEstimate'])->toBeTrue();
});

test('says nothing about a period that has not started', function (): void {
    $user = User::factory()->create();

    $october = fiscalItems($user)
        ->firstWhere(fn (array $deadline): bool => $deadline['kind'] === FiscalDeadlineKind::UrssafDeclaration->value
            && $deadline['periodKey'] === '2026-10');

    expect($october['amount'])->toBeNull();
});

test('shows the CFE date with no figure rather than hiding it', function (): void {
    $user = User::factory()->create();

    $cfe = fiscalItems($user)->firstWhere('kind', FiscalDeadlineKind::Cfe->value);

    expect($cfe['dueOn'])->toBe('2026-12-15')
        ->and($cfe['amount'])->toBeNull();
});

test('estimates the CFE from what left the account for it last year', function (): void {
    $user = User::factory()->create();

    fiscDebitOn($user, '2025-12-14', 43_000, 'DGFIP CFE 2025');

    $cfe = fiscalItems($user)->firstWhere('kind', FiscalDeadlineKind::Cfe->value);

    expect($cfe['amount']['amount'])->toBe(43_000)
        ->and($cfe['isEstimate'])->toBeTrue();
});

test('the entered amount overrides the bank estimate', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['cfe_expected_cents' => 48_000]);

    fiscDebitOn($user, '2025-12-14', 43_000, 'DGFIP CFE 2025');

    $cfe = fiscalItems($user->fresh())->firstWhere('kind', FiscalDeadlineKind::Cfe->value);

    expect($cfe['amount']['amount'])->toBe(48_000)
        ->and($cfe['isEstimate'])->toBeFalse();
});

test('splits a CFE over 3 000 € across its two dates without charging it twice', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['cfe_expected_cents' => 400_000]);

    $fiscal = fiscalItems($user->fresh());

    expect($fiscal->firstWhere('kind', FiscalDeadlineKind::CfeInstalment->value)['amount']['amount'])
        ->toBe(200_000)
        ->and($fiscal->firstWhere('kind', FiscalDeadlineKind::Cfe->value)['amount']['amount'])
        // The rest, not the whole bill again.
        ->toBe(200_000);
});

test('follows the regime and the periodicity of the account', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update([
        'vat_regime' => VatRegime::ReelNormal,
        'urssaf_periodicity' => UrssafPeriodicity::Quarterly,
    ]);

    $fiscal = fiscalItems($user->fresh());

    expect($fiscal->firstWhere('kind', FiscalDeadlineKind::VatCa3->value)['dueOn'])->toBe('2026-06-15')
        ->and($fiscal->firstWhere('kind', FiscalDeadlineKind::UrssafDeclaration->value)['periodKey'])
        ->toBe('2026-Q2');
});

test('nothing is owed for a period that closed before the business opened', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['business_started_on' => '2026-07-01']);

    $fiscal = fiscalItems($user->fresh());

    expect($fiscal->pluck('periodEnd')->min())->toBe('2026-07-31')
        ->and($fiscal->where('kind', FiscalDeadlineKind::UrssafDeclaration->value)->pluck('periodKey')->first())
        ->toBe('2026-07');
});

test('a business outside France still sees its open invoices, without a fiscal calendar', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['business_country' => 'BE']);
    openInvoiceDueOn($user->fresh(), '2026-09-04');

    $items = boardItems($user->fresh());

    expect($items->whereNotNull('fiscal'))->toHaveLength(0)
        ->and($items->where('type', DeadlineItemType::InvoiceDue->value))->toHaveLength(1);
});

test('requires an authenticated account', function (): void {
    $this->getJson('/api/deadlines')->assertUnauthorized();
});

test('a rough barème figure stands in when nothing better exists', function (): void {
    $user = User::factory()->create();

    // 50 000 € HT collected in 2025 puts the account in the 32.6k–100k
    // bracket: mid-base 1 338 € × the 27 % ballpark rate ≈ 360 €.
    paidInvoiceOn($user, '2025-06-10', htCents: 5_000_000, ttcCents: 6_000_000);

    $cfe = fiscalItems($user)->firstWhere('kind', FiscalDeadlineKind::Cfe->value);

    expect($cfe['amount']['amount'])->toBe(36_000)
        ->and($cfe['isEstimate'])->toBeTrue();
});

test('last year’s detected payment beats the barème guess', function (): void {
    $user = User::factory()->create();

    paidInvoiceOn($user, '2025-06-10', htCents: 5_000_000, ttcCents: 6_000_000);
    fiscDebitOn($user, '2025-12-14', 43_000, 'DGFIP CFE 2025');

    $cfe = fiscalItems($user)->firstWhere('kind', FiscalDeadlineKind::Cfe->value);

    expect($cfe['amount']['amount'])->toBe(43_000);
});

test('a young account is estimated from what this year collected so far', function (): void {
    $user = User::factory()->create();

    // Nothing in 2025 — the current year's collections stand in.
    paidInvoiceOn($user, '2026-03-10', htCents: 2_000_000, ttcCents: 2_400_000);

    $cfe = fiscalItems($user)->firstWhere('kind', FiscalDeadlineKind::Cfe->value);

    // 20 000 € lands in the 10k–32.6k bracket: mid-base 700 € × 27 % ≈ 190 €.
    expect($cfe['amount']['amount'])->toBe(19_000)
        ->and($cfe['isEstimate'])->toBeTrue();
});

test('a revenue under the exemption floor guesses nothing', function (): void {
    $user = User::factory()->create();

    paidInvoiceOn($user, '2025-06-10', htCents: 400_000, ttcCents: 480_000);

    $cfe = fiscalItems($user)->firstWhere('kind', FiscalDeadlineKind::Cfe->value);

    expect($cfe['amount'])->toBeNull();
});
