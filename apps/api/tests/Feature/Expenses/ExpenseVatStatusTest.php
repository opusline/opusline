<?php

declare(strict_types=1);

use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Enums\ExpenseVatStatus;
use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Expenses\Factories\ExpenseFactory;
use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\Storage;

beforeEach(function (): void {
    freezeTodayAtUtcNoon();
    Storage::fake('local');
});

test('a receipted purchase is deductible on its own month', function (): void {
    $user = vatLiableUser();
    receiptedExpenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-05')->ttc(12_000));

    $this->actingAs($user)
        ->getJson('/api/expenses?month=2026-08')
        ->assertOk()
        ->assertJsonPath('expenses.0.vatStatus', ExpenseVatStatus::Deductible->value)
        ->assertJsonPath('expenses.0.vatClaimPeriod', '2026-08')
        ->assertJsonPath('expenses.0.isRegularisation', false)
        ->assertJsonPath('vat.deductible.amount', 2_000)
        ->assertJsonPath('vat.blocked.amount', 0)
        ->assertJsonPath('declaredOn', null);
});

test('a purchase without a receipt is blocked and counted apart', function (): void {
    $user = vatLiableUser();
    expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-05')->ttc(12_000));

    $this->actingAs($user)
        ->getJson('/api/expenses?month=2026-08')
        ->assertOk()
        ->assertJsonPath('expenses.0.vatStatus', ExpenseVatStatus::Blocked->value)
        ->assertJsonPath('vat.deductible.amount', 0)
        ->assertJsonPath('vat.blocked.amount', 2_000)
        ->assertJsonPath('vat.blockedCount', 1);
});

test('a reverse-charged purchase nets to nothing and an exempt one carries nothing', function (): void {
    $user = vatLiableUser();
    expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-05')->reverseCharged(4_800));
    expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-06')->exempt(31_200));

    $this->actingAs($user)
        ->getJson('/api/expenses?month=2026-08')
        ->assertOk()
        ->assertJsonPath('expenses.0.vatStatus', ExpenseVatStatus::NotApplicable->value)
        ->assertJsonPath('expenses.1.vatStatus', ExpenseVatStatus::ReverseCharged->value)
        ->assertJsonPath('vat.reverseCharged.amount', 960)
        ->assertJsonPath('vat.deductible.amount', 0);
});

test('an account abroad files no CA3, whatever régime its invoices are pinned to', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['business_country' => 'DE', 'vat_regime' => VatRegime::ReelNormal]);
    receiptedExpenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-05'));

    $this->actingAs($user)
        ->getJson('/api/expenses?month=2026-08')
        ->assertOk()
        ->assertJsonPath('expenses.0.vatStatus', ExpenseVatStatus::NotApplicable->value)
        ->assertJsonPath('expenses.0.isRegularisation', false)
        ->assertJsonPath('vat', null);
});

test('a receipt whose TVA is not tracked has nothing to deduct, receipt or not', function (): void {
    $user = vatLiableUser();
    expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-05')->ttc(12_000, 0));

    $this->actingAs($user)
        ->getJson('/api/expenses?month=2026-08')
        ->assertOk()
        ->assertJsonPath('expenses.0.vatStatus', ExpenseVatStatus::NotApplicable->value)
        ->assertJsonPath('vat.blockedCount', 0);
});

test('an account under the franchise has no TVA to deduct and no summary', function (): void {
    $user = User::factory()->create();
    receiptedExpenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-05'));

    $this->actingAs($user)
        ->getJson('/api/expenses?month=2026-08')
        ->assertOk()
        ->assertJsonPath('expenses.0.vatStatus', ExpenseVatStatus::NotApplicable->value)
        ->assertJsonPath('vat', null)
        ->assertJsonPath('declaredOn', null);
});

test('once the month is declared, receipted purchases read as deducted and the banner carries the date', function (): void {
    $user = vatLiableUser();
    receiptedExpenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-07-05')->ttc(12_000));
    ca3DeclaredFor($user, '2026-07', '2026-08-10');

    $this->actingAs($user)
        ->getJson('/api/expenses?month=2026-07')
        ->assertOk()
        ->assertJsonPath('expenses.0.vatStatus', ExpenseVatStatus::Deducted->value)
        ->assertJsonPath('declaredOn', '2026-08-10')
        ->assertJsonPath('vat.deductible.amount', 2_000);
});

test('a purchase recorded into a declared month is claimed on the next open one', function (): void {
    $user = vatLiableUser();
    ca3DeclaredFor($user, '2026-07');

    $this->actingAs($user)
        ->postJson('/api/expenses', [
            'supplier' => 'Brouillard Hébergement',
            'spentOn' => '2026-07-20',
            'category' => ExpenseCategory::Hosting->value,
            'amountTtc' => ['amount' => 12_000, 'currency' => 'EUR'],
            'vatTreatment' => ExpenseVatTreatment::Domestic->value,
            'vatRateBp' => 2_000,
        ])
        ->assertCreated()
        ->assertJsonPath('expenses.0.vatClaimPeriod', '2026-08')
        ->assertJsonPath('expenses.0.isRegularisation', true);
});

test('a receipt attached after the month was declared moves the deduction to the next open month', function (): void {
    $user = vatLiableUser();
    $expense = expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-07-05')->ttc(12_000));
    ca3DeclaredFor($user, '2026-07');

    attachReceiptTo($user, $expense)
        ->assertCreated()
        ->assertJsonPath('expenses.0.vatStatus', ExpenseVatStatus::Deferred->value)
        ->assertJsonPath('expenses.0.vatClaimPeriod', '2026-08')
        ->assertJsonPath('expenses.0.isRegularisation', true)
        ->assertJsonPath('vat.deductible.amount', 0)
        ->assertJsonPath('vat.deferred.amount', 2_000);

    // August's CA3 lists it: the row is not August's, but its deduction is.
    $this->actingAs($user)
        ->getJson('/api/expenses?month=2026-08')
        ->assertOk()
        ->assertJsonCount(0, 'expenses')
        ->assertJsonPath('vat.deductible.amount', 2_000);
});

test('a date moved past a hand deferral re-claims from the new purchase month', function (): void {
    $user = vatLiableUser();
    $expense = receiptedExpenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-06-05')->ttc(12_000));
    $this->actingAs($user)->postJson('/api/expenses/vat-deferrals', ['expenseIds' => [$expense->id]])->assertOk();

    $this->actingAs($user)
        ->putJson("/api/expenses/{$expense->id}", [
            'supplier' => 'Brouillard Hébergement',
            'spentOn' => '2026-08-05',
            'category' => ExpenseCategory::Hosting->value,
            'amountTtc' => ['amount' => 12_000, 'currency' => 'EUR'],
            'vatTreatment' => ExpenseVatTreatment::Domestic->value,
            'vatRateBp' => 2_000,
        ])
        ->assertOk()
        ->assertJsonPath('month', '2026-08')
        ->assertJsonPath('expenses.0.vatClaimPeriod', '2026-08')
        ->assertJsonPath('expenses.0.vatStatus', ExpenseVatStatus::Deductible->value);
});

test('a cosmetic edit keeps the claim where it is, an amount change in a declared month moves it', function (): void {
    $user = vatLiableUser();
    $expense = receiptedExpenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-07-05')->ttc(12_000));
    ca3DeclaredFor($user, '2026-07');

    $body = [
        'supplier' => 'Renamed',
        'spentOn' => '2026-07-05',
        'category' => ExpenseCategory::Software->value,
        'amountTtc' => ['amount' => 12_000, 'currency' => 'EUR'],
        'vatTreatment' => ExpenseVatTreatment::Domestic->value,
        'vatRateBp' => 2_000,
    ];

    $this->actingAs($user)
        ->putJson("/api/expenses/{$expense->id}", $body)
        ->assertOk()
        ->assertJsonPath('expenses.0.vatClaimPeriod', '2026-07')
        ->assertJsonPath('expenses.0.vatStatus', ExpenseVatStatus::Deducted->value);

    $this->actingAs($user)
        ->putJson("/api/expenses/{$expense->id}", ['amountTtc' => ['amount' => 24_000, 'currency' => 'EUR'], ...array_diff_key($body, ['amountTtc' => true])])
        ->assertOk()
        ->assertJsonPath('expenses.0.vatClaimPeriod', '2026-08')
        ->assertJsonPath('expenses.0.isRegularisation', true);
});

test('collected minus deductible is what the CA3 owes, a credit when negative', function (): void {
    $user = vatLiableUser();
    paidInvoiceOn($user, '2026-08-10', htCents: 100_000, ttcCents: 120_000);
    receiptedExpenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-05')->ttc(150_000));

    $this->actingAs($user)
        ->getJson('/api/expenses?month=2026-08')
        ->assertOk()
        ->assertJsonPath('vat.collected.amount', 20_000)
        ->assertJsonPath('vat.deductible.amount', 25_000)
        ->assertJsonPath('vat.balance.amount', -5_000);
});
