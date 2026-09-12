<?php

declare(strict_types=1);

use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Deadlines\Models\FiscalDeadlineCompletion;
use App\Domain\Expenses\Factories\ExpenseFactory;
use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

test('walks the shown month and the five before it, newest first', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['contribution_rate_bp' => 2_500, 'liberating_payment' => false]);
    paidInvoiceOn($user, '2026-07-10');
    paidInvoiceOn($user, '2026-02-10');
    paidInvoiceOn($user, '2026-01-10');
    FiscalDeadlineCompletion::factory()->for($user)->of(FiscalDeadlineKind::UrssafDeclaration, '2026-02')
        ->completedOn('2026-03-20')->paidOn('2026-03-31')->create();

    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonCount(6, 'history')
        ->assertJsonPath('history.0.period', '2026-07')
        ->assertJsonPath('history.0.urssaf.period', '2026-07')
        ->assertJsonPath('history.0.urssaf.total.amount', 41_580)
        ->assertJsonPath('history.0.urssaf.completion', null)
        ->assertJsonPath('history.0.vat', null)
        ->assertJsonPath('history.5.period', '2026-02')
        ->assertJsonPath('history.5.urssaf.total.amount', 41_580)
        ->assertJsonPath('history.5.urssaf.completion.declaredOn', '2026-03-20')
        ->assertJsonPath('history.5.urssaf.completion.paidOn', '2026-03-31')
        ->assertJsonMissingPath('history.6');
});

test('shows the quarter on each of its months and nothing while it still runs', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['urssaf_periodicity' => UrssafPeriodicity::Quarterly, 'contribution_rate_bp' => 2_500, 'liberating_payment' => false]);
    paidInvoiceOn($user, '2026-05-10');
    paidInvoiceOn($user, '2026-06-10');

    // July sits in Q3, still running on 13 August.
    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('history.0.period', '2026-07')
        ->assertJsonPath('history.0.urssaf', null)
        ->assertJsonPath('history.1.urssaf.period', '2026-Q2')
        ->assertJsonPath('history.1.urssaf.total.amount', 83_160)
        ->assertJsonPath('history.3.urssaf.period', '2026-Q2')
        ->assertJsonPath('history.4.urssaf.period', '2026-Q1')
        ->assertJsonPath('history.4.urssaf.total.amount', 0);
});

test('carries the CA3 of each month, credit and all', function (): void {
    $user = vatLiableUser();
    // May builds a credit of 20 000 that June uses up: 33 000 collected − 20 000 = 13 000 due.
    receiptedExpenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-05-05')->ttc(120_000));
    paidInvoiceOn($user, '2026-06-10');
    ca3DeclaredFor($user, '2026-05', '2026-06-15');

    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('history.0.vat.due.amount', 0)
        ->assertJsonPath('history.1.period', '2026-06')
        ->assertJsonPath('history.1.vat.due.amount', 13_000)
        ->assertJsonPath('history.1.vat.credit.amount', 0)
        ->assertJsonPath('history.1.vat.completion', null)
        ->assertJsonPath('history.2.vat.due.amount', 0)
        ->assertJsonPath('history.2.vat.credit.amount', 20_000)
        ->assertJsonPath('history.2.vat.completion.declaredOn', '2026-06-15');
});

test('reads a month before the first return as a chain of its own', function (): void {
    $user = vatLiableUser();
    // Bought before any CA3 was filed: a credit the fisc never saw, so it
    // must not reach June through the chain anchored on May.
    receiptedExpenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-03-05')->ttc(120_000));
    ca3DeclaredFor($user, '2026-05', '2026-06-15');
    paidInvoiceOn($user, '2026-06-10');

    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('history.1.period', '2026-06')
        ->assertJsonPath('history.1.vat.due.amount', 33_000)
        ->assertJsonPath('history.3.period', '2026-04')
        ->assertJsonPath('history.3.vat.credit.amount', 0)
        ->assertJsonPath('history.4.period', '2026-03')
        ->assertJsonPath('history.4.vat.credit.amount', 20_000);
});

test('leaves the months before the business started blank', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['business_started_on' => '2026-05-15']);

    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('history.2.period', '2026-05')
        ->assertJsonPath('history.2.urssaf.period', '2026-05')
        ->assertJsonPath('history.3.period', '2026-04')
        ->assertJsonPath('history.3.urssaf', null);
});

test('has no history outside french fiscality', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['business_country' => 'BE']);

    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('history', []);
});
