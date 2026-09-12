<?php

declare(strict_types=1);

use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Expenses\Factories\ExpenseFactory;
use Illuminate\Support\Facades\Storage;

beforeEach(function (): void {
    freezeTodayAtUtcNoon();
    Storage::fake('local');
});

test('lists every case of the form from the invoices and the receipted purchases of the month', function (): void {
    $user = vatLiableUser();
    paidInvoiceOn($user, '2026-07-10', htCents: 840_000, ttcCents: 1_008_000);
    // 14,39 € TTC at 20 % → 11,99 HT, 2,40 TVA.
    receiptedExpenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-07-08')->ttc(1_439));
    // Self-assessed: 31,20 € HT from an EU supplier, 48 € HT from outside the EU.
    expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-07-18')->reverseCharged(3_120, ExpenseVatTreatment::ReverseChargeEu));
    expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-07-15')->reverseCharged(4_800));
    // No receipt: nothing to deduct yet.
    expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-07-12')->ttc(8_400));

    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('vat.boxes.salesHt.amount', 840_000)
        ->assertJsonPath('vat.boxes.intraCommunityPurchasesHt.amount', 3_120)
        ->assertJsonPath('vat.boxes.nonEuPurchasesHt.amount', 4_800)
        ->assertJsonPath('vat.boxes.taxableBase.amount', 847_920)
        ->assertJsonPath('vat.boxes.collected.amount', 169_584)
        ->assertJsonPath('vat.collected.amount', 168_000)
        ->assertJsonPath('vat.reverseChargedVat.amount', 1_584)
        ->assertJsonPath('vat.boxes.goodsAndServices.amount', 1_824)
        ->assertJsonPath('vat.boxes.otherDeductible.amount', 0)
        ->assertJsonPath('vat.boxes.creditCarried.amount', 0)
        ->assertJsonPath('vat.boxes.credit.amount', 0)
        ->assertJsonPath('vat.boxes.due.amount', 167_760)
        ->assertJsonPath('vat.expenseCount', 4)
        ->assertJsonPath('vat.invoiceCount', 1);
});

test('a receipt landing on a declared month is listed as other deductible TVA on the next return', function (): void {
    $user = vatLiableUser();
    paidInvoiceOn($user, '2026-06-10', htCents: 100_000, ttcCents: 120_000);
    $late = expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-06-20')->ttc(12_000));
    ca3DeclaredFor($user, '2026-06', '2026-07-15');
    attachReceiptTo($user, $late)->assertCreated();

    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-06')
        ->assertOk()
        ->assertJsonPath('vat.boxes.goodsAndServices.amount', 0)
        ->assertJsonPath('vat.boxes.due.amount', 20_000);

    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('vat.boxes.goodsAndServices.amount', 0)
        ->assertJsonPath('vat.boxes.otherDeductible.amount', 2_000)
        ->assertJsonPath('vat.expenseCount', 0);
});

test('a credit carries from one month to the next until it is used up', function (): void {
    $user = vatLiableUser();
    // May: 25 000 collected, 101 600 deductible → credit 76 600, refundable.
    paidInvoiceOn($user, '2026-05-10', htCents: 125_000, ttcCents: 150_000);
    receiptedExpenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-05-05')->ttc(609_600));
    // June: 55 000 collected, nothing bought → 21 600 credit left.
    paidInvoiceOn($user, '2026-06-10', htCents: 275_000, ttcCents: 330_000);
    // July: 168 000 collected → 146 400 due.
    paidInvoiceOn($user, '2026-07-10', htCents: 840_000, ttcCents: 1_008_000);

    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-05')
        ->assertOk()
        ->assertJsonPath('vat.boxes.credit.amount', 76_600)
        ->assertJsonPath('vat.boxes.due.amount', 0)
        ->assertJsonPath('vat.creditIsRefundable', true);

    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-06')
        ->assertOk()
        ->assertJsonPath('vat.boxes.creditCarried.amount', 76_600)
        ->assertJsonPath('vat.boxes.credit.amount', 21_600)
        ->assertJsonPath('vat.boxes.due.amount', 0)
        ->assertJsonPath('vat.creditIsRefundable', false);

    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('vat.boxes.creditCarried.amount', 21_600)
        ->assertJsonPath('vat.boxes.due.amount', 146_400)
        ->assertJsonPath('vat.boxes.credit.amount', 0);
});

test('only the professional share of a purchase reaches the deductible line', function (): void {
    $user = vatLiableUser();
    paidInvoiceOn($user, '2026-07-10', htCents: 100_000, ttcCents: 120_000);
    receiptedExpenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-07-05')->ttc(2_900)->proShare(7_000));

    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('vat.boxes.goodsAndServices.amount', 338)
        ->assertJsonPath('vat.boxes.due.amount', 19_662);
});

test('a self-assessed purchase reaching a declared month is filed on the next return', function (): void {
    $user = vatLiableUser();
    ca3DeclaredFor($user, '2026-06', '2026-07-15');
    $this->actingAs($user)->postJson('/api/expenses', [
        'supplier' => 'Kestrel Devtools',
        'spentOn' => '2026-06-20',
        'category' => 1,
        'amountTtc' => ['amount' => 3_120, 'currency' => 'EUR'],
        'vatTreatment' => ExpenseVatTreatment::ReverseChargeEu->value,
        'vatRateBp' => 2_000,
        'proShareBp' => 5_000,
    ])->assertCreated()->assertJsonPath('expenses.0.vatClaimPeriod', '2026-07');

    $this->actingAs($user)->getJson('/api/declarations?period=2026-06')->assertOk()
        ->assertJsonPath('vat.boxes.intraCommunityPurchasesHt.amount', 0)
        ->assertJsonPath('vat.boxes.collected.amount', 0);
    $this->actingAs($user)->getJson('/api/declarations?period=2026-07')->assertOk()
        ->assertJsonPath('vat.boxes.intraCommunityPurchasesHt.amount', 3_120)
        ->assertJsonPath('vat.boxes.collected.amount', 624)
        ->assertJsonPath('vat.boxes.goodsAndServices.amount', 312)
        ->assertJsonPath('vat.boxes.due.amount', 312);
});

test('the chain is anchored on the first return ever filed', function (): void {
    $user = vatLiableUser();
    // Bought under the franchise, long before any CA3: must not mint a credit.
    receiptedExpenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2025-11-05')->ttc(120_000));
    ca3DeclaredFor($user, '2026-06', '2026-07-15');
    paidInvoiceOn($user, '2026-07-10', htCents: 100_000, ttcCents: 120_000);

    $this->actingAs($user)->getJson('/api/declarations?period=2026-07')->assertOk()
        ->assertJsonPath('vat.boxes.creditCarried.amount', 0)
        ->assertJsonPath('vat.boxes.due.amount', 20_000);
});

test('a purchase deferred by hand is deducted on the next return', function (): void {
    $user = vatLiableUser();
    $expense = receiptedExpenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-06-05')->ttc(12_000));
    $this->actingAs($user)->postJson('/api/expenses/vat-deferrals', ['expenseIds' => [$expense->id]])->assertOk();

    $this->actingAs($user)->getJson('/api/declarations?period=2026-06')->assertOk()->assertJsonPath('vat.boxes.goodsAndServices.amount', 0);
    $this->actingAs($user)->getJson('/api/declarations?period=2026-07')->assertOk()
        ->assertJsonPath('vat.boxes.goodsAndServices.amount', 2_000)
        ->assertJsonPath('vat.boxes.otherDeductible.amount', 0);
});
