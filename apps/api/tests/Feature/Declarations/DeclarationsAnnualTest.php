<?php

declare(strict_types=1);

use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Deadlines\Models\FiscalDeadlineCompletion;
use App\Domain\Declarations\Enums\IncomeTaxReturnBox;
use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

/** A monthly account started in June 2025, with 1 650 € HT collected in December 2025, March 2026 and July 2026. */
function annualAccount(bool $liberatingPayment = false): User
{
    $user = User::factory()->create();
    $user->settings()->sole()->update([
        'business_started_on' => '2025-06-01',
        'contribution_rate_bp' => 2_500,
        'liberating_payment' => $liberatingPayment,
        'liberating_payment_rate_bp' => 220,
        'cfe_expected_cents' => null,
    ]);
    paidInvoiceOn($user, '2026-03-10');
    paidInvoiceOn($user, '2026-07-10');
    paidInvoiceOn($user, '2025-12-20');

    return $user;
}

test('prepares the 2042-C PRO of the year: the receipts, their box, and what stays taxable', function (): void {
    // 330 000 collected in 2026; the 34 % abatement leaves 66 % = 217 800.
    $this->actingAs(annualAccount())
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('annual.incomeTaxReturn.year', 2026)
        ->assertJsonPath('annual.incomeTaxReturn.dueOn', '2027-05-31')
        ->assertJsonPath('annual.incomeTaxReturn.grossReceipts.amount', 330_000)
        ->assertJsonPath('annual.incomeTaxReturn.box', IncomeTaxReturnBox::WithoutLiberatingPayment->value)
        ->assertJsonPath('annual.incomeTaxReturn.taxableAfterAbatement.amount', 217_800)
        ->assertJsonPath('annual.incomeTaxReturn.liberatingPaymentPaid', null)
        ->assertJsonPath('annual.incomeTaxReturn.completion', null)
        ->assertJsonCount(12, 'annual.incomeTaxReturn.periods')
        ->assertJsonPath('annual.incomeTaxReturn.periods.2.period', '2026-03')
        ->assertJsonPath('annual.incomeTaxReturn.periods.2.base.amount', 165_000)
        ->assertJsonPath('annual.incomeTaxReturn.periods.3.base.amount', 0);
});

test('the versement libératoire moves the receipts to case 5TE and shows what it already settled', function (): void {
    // 2,2 % of each declared month: 3 630 twice.
    $user = annualAccount(liberatingPayment: true);
    FiscalDeadlineCompletion::factory()->for($user)->of(FiscalDeadlineKind::UrssafDeclaration, '2026-03')->completedOn('2026-04-20')->create();

    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('annual.incomeTaxReturn.box', IncomeTaxReturnBox::WithLiberatingPayment->value)
        ->assertJsonPath('annual.incomeTaxReturn.liberatingPaymentPaid.amount', 7_260)
        ->assertJsonPath('annual.incomeTaxReturn.periods.2.declaredOn', '2026-04-20')
        ->assertJsonPath('annual.incomeTaxReturn.periods.6.declaredOn', null);
});

test('a quarterly account checks four declarations, not twelve', function (): void {
    $user = annualAccount();
    $user->settings()->sole()->update(['urssaf_periodicity' => UrssafPeriodicity::Quarterly]);

    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonCount(4, 'annual.incomeTaxReturn.periods')
        ->assertJsonPath('annual.incomeTaxReturn.periods.0.period', '2026-Q1')
        ->assertJsonPath('annual.incomeTaxReturn.periods.0.base.amount', 165_000);
});

test('small receipts never fall under the abatement floor', function (): void {
    $user = User::factory()->create();
    paidInvoiceOn($user, '2026-02-10', htCents: 20_000, ttcCents: 24_000);

    // 200 € of receipts, a 305 € floor: nothing taxable, never a negative.
    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('annual.incomeTaxReturn.taxableAfterAbatement.amount', 0);
});

test('the CFE of the running year reads the account expectation and the twelfths set aside', function (): void {
    $user = annualAccount();
    $user->settings()->sole()->update(['cfe_expected_cents' => 31_200]);

    // Eight months into 2026: 31 200 × 8 / 12 = 20 800 should be on the compte pro.
    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('annual.cfe.year', 2026)
        ->assertJsonPath('annual.cfe.dueOn', '2026-12-15')
        ->assertJsonPath('annual.cfe.expected.amount', 31_200)
        ->assertJsonPath('annual.cfe.isEstimate', false)
        ->assertJsonPath('annual.cfe.monthsProvisioned', 8)
        ->assertJsonPath('annual.cfe.provisioned.amount', 20_800)
        ->assertJsonPath('annual.cfe.gap.amount', -10_400)
        ->assertJsonPath('annual.cfe.completion', null);
});

test('the year the business started owes no CFE', function (): void {
    $user = annualAccount();
    $user->settings()->sole()->update(['business_started_on' => '2026-01-15']);

    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('annual.cfe', null)
        ->assertJsonPath('annual.incomeTaxReturn.year', 2026);
});

test('an older year shows its CFE tick but guesses no bill', function (): void {
    $user = annualAccount();
    $user->settings()->sole()->update(['business_started_on' => '2024-06-01']);
    FiscalDeadlineCompletion::factory()->for($user)->of(FiscalDeadlineKind::Cfe, '2025')->completedOn('2025-12-10')->paidOn('2025-12-15')->create();

    $this->actingAs($user)
        ->getJson('/api/declarations?period=2025-12')
        ->assertOk()
        ->assertJsonPath('annual.cfe.year', 2025)
        ->assertJsonPath('annual.cfe.expected', null)
        ->assertJsonPath('annual.cfe.monthsProvisioned', 12)
        ->assertJsonPath('annual.cfe.completion.paidOn', '2025-12-15')
        ->assertJsonPath('annual.incomeTaxReturn.grossReceipts.amount', 165_000);
});

test('marking the 2042 as filed ticks the year', function (): void {
    markDeclared(annualAccount(), FiscalDeadlineKind::IncomeTaxReturn, '2026', period: '2026-07')
        ->assertCreated()
        ->assertJsonPath('annual.incomeTaxReturn.completion.declaredOn', '2026-08-13');
});

test('paying the CFE books it once as a Taxes expense', function (): void {
    $user = annualAccount();
    $user->settings()->sole()->update(['cfe_expected_cents' => 31_200]);
    markDeclared($user, FiscalDeadlineKind::Cfe, '2026', period: '2026-07')->assertCreated();

    foreach (range(1, 2) as $attempt) {
        $this->actingAs($user)
            ->postJson(completionPath(FiscalDeadlineKind::Cfe, '2026', '/payment?period=2026-07'))
            ->assertCreated()
            ->assertJsonPath('annual.cfe.completion.paidOn', '2026-08-13');
    }

    $expense = $user->expenses()->where('category', ExpenseCategory::Taxes)->sole();

    expect($expense->description)->toBe('CFE 2026')
        ->and((int) $expense->amount_ttc_cents->getAmount())->toBe(31_200)
        ->and((int) $expense->amount_ht_cents->getAmount())->toBe(31_200)
        ->and($expense->spent_on->toDateString())->toBe('2026-08-13');
});

test('paying the CFE without any expected amount books nothing', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['business_started_on' => '2025-06-01']);
    FiscalDeadlineCompletion::factory()->for($user)->of(FiscalDeadlineKind::Cfe, '2026')->completedOn('2026-08-10')->create();

    $this->actingAs($user)
        ->postJson(completionPath(FiscalDeadlineKind::Cfe, '2026', '/payment?period=2026-07'))
        ->assertCreated();

    expect($user->expenses()->count())->toBe(0);
});

test('paying an older year CFE keeps the date but books nothing, since the bill cannot be guessed', function (): void {
    $user = annualAccount();
    $user->settings()->sole()->update(['business_started_on' => '2024-06-01', 'cfe_expected_cents' => 31_200]);
    FiscalDeadlineCompletion::factory()->for($user)->of(FiscalDeadlineKind::Cfe, '2025')->completedOn('2025-12-10')->create();

    $this->actingAs($user)
        ->postJson(completionPath(FiscalDeadlineKind::Cfe, '2025', '/payment?period=2025-12'))
        ->assertCreated()
        ->assertJsonPath('annual.cfe.completion.paidOn', '2026-08-13');

    expect($user->expenses()->count())->toBe(0);
});

test('a paid CFE holds no twelfths any more', function (): void {
    $user = annualAccount();
    $user->settings()->sole()->update(['cfe_expected_cents' => 31_200]);
    FiscalDeadlineCompletion::factory()->for($user)->of(FiscalDeadlineKind::Cfe, '2026')->completedOn('2026-08-10')->paidOn('2026-08-12')->create();

    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('annual.cfe.expected.amount', 31_200)
        ->assertJsonPath('annual.cfe.provisioned', null)
        ->assertJsonPath('annual.cfe.gap', null);
});

test('the coherence table starts with the first declaration the business owed', function (): void {
    $user = annualAccount();
    $user->settings()->sole()->update(['business_started_on' => '2026-03-15']);

    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonCount(10, 'annual.incomeTaxReturn.periods')
        ->assertJsonPath('annual.incomeTaxReturn.periods.0.period', '2026-03');
});

test('has no annual returns', function (array $settings, string $period): void {
    $user = annualAccount();
    $user->settings()->sole()->update($settings);

    $this->actingAs($user)->getJson("/api/declarations?period={$period}")->assertOk()->assertJsonPath('annual', null);
})->with([
    'for a year that closed before the business started' => [[], '2024-06'],
    'outside French fiscality' => [['business_country' => 'BE'], '2026-07'],
]);
