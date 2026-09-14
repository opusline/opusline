<?php

declare(strict_types=1);

use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Factories\ExpenseFactory;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

test('shows the current month by default, newest first', function (): void {
    $user = User::factory()->create();
    expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-02')->state(['supplier' => 'Early']));
    expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-12')->state(['supplier' => 'Late']));
    expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-07-30')->state(['supplier' => 'July']));

    $this->actingAs($user)
        ->getJson('/api/expenses')
        ->assertOk()
        ->assertJsonPath('month', '2026-08')
        ->assertJsonCount(2, 'expenses')
        ->assertJsonPath('expenses.0.supplier', 'Late')
        ->assertJsonPath('expenses.1.supplier', 'Early');
});

test('shows the requested month with its totals and category bars', function (): void {
    $user = User::factory()->create();
    expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-07-05')->ttc(12_000)->category(ExpenseCategory::Equipment));
    expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-07-09')->ttc(2_400)->category(ExpenseCategory::Software));
    expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-07-20')->ttc(3_600)->category(ExpenseCategory::Software));
    expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-01')->ttc(99_999));

    $this->actingAs($user)
        ->getJson('/api/expenses?month=2026-07')
        ->assertOk()
        ->assertJsonPath('month', '2026-07')
        ->assertJsonPath('totals.count', 3)
        ->assertJsonPath('totals.ttc.amount', 18_000)
        ->assertJsonPath('totals.ht.amount', 15_000)
        ->assertJsonPath('categories.0.category', ExpenseCategory::Equipment->value)
        ->assertJsonPath('categories.0.ht.amount', 10_000)
        ->assertJsonPath('categories.0.shareBp', 10_000)
        ->assertJsonPath('categories.1.category', ExpenseCategory::Software->value)
        ->assertJsonPath('categories.1.ht.amount', 5_000)
        ->assertJsonPath('categories.1.shareBp', 5_000);
});

test('charts the twelve months ending with the shown one', function (): void {
    $user = User::factory()->create();
    expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2025-09-15')->ttc(1_200));
    // A month before the window: out of the chart.
    expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2025-08-31')->ttc(6_000));
    expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-13')->ttc(2_400));

    $response = $this->actingAs($user)
        ->getJson('/api/expenses?month=2026-08')
        ->assertOk()
        ->assertJsonCount(12, 'series')
        ->assertJsonPath('series.0.month', '2025-09')
        ->assertJsonPath('series.0.ht.amount', 1_000)
        ->assertJsonPath('series.11.month', '2026-08')
        ->assertJsonPath('series.11.ht.amount', 2_000)
        ->assertJsonPath('series.11.ttc.amount', 2_400);

    expect(array_sum(array_map(fn (array $point): int => $point['ht']['amount'], $response->json('series'))))->toBe(3_000);
});

test('compares the run rate of charges with the micro-BNC abatement for a French account', function (): void {
    $user = User::factory()->create();
    paidInvoiceOn($user, '2026-02-10', htCents: 1_000_000, ttcCents: 1_200_000);
    // Collected more than a year before the shown month: outside the trailing year.
    paidInvoiceOn($user, '2025-08-31', htCents: 5_000_000, ttcCents: 6_000_000);
    expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-05')->ttc(24_000));

    $this->actingAs($user)
        ->getJson('/api/expenses?month=2026-08')
        ->assertOk()
        ->assertJsonPath('projection.projectedChargesHt.amount', 240_000)
        ->assertJsonPath('projection.annualRevenueHt.amount', 1_000_000)
        ->assertJsonPath('projection.abatement.amount', 340_000)
        ->assertJsonPath('projection.microIsFavourable', true);
});

test('says when real charges would beat the abatement', function (): void {
    $user = User::factory()->create();
    paidInvoiceOn($user, '2026-06-10', htCents: 100_000, ttcCents: 120_000);
    expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-05')->ttc(6_000));

    $this->actingAs($user)
        ->getJson('/api/expenses?month=2026-08')
        ->assertOk()
        ->assertJsonPath('projection.projectedChargesHt.amount', 60_000)
        ->assertJsonPath('projection.abatement.amount', 34_000)
        ->assertJsonPath('projection.microIsFavourable', false);
});

test('never lets the abatement fall under its statutory floor', function (): void {
    $user = User::factory()->create();
    expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-05')->ttc(1_200));

    $this->actingAs($user)
        ->getJson('/api/expenses?month=2026-08')
        ->assertOk()
        ->assertJsonPath('projection.annualRevenueHt.amount', 0)
        ->assertJsonPath('projection.abatement.amount', 30_500)
        ->assertJsonPath('projection.projectedChargesHt.amount', 12_000)
        ->assertJsonPath('projection.microIsFavourable', true);
});

test('has no régime projection outside French fiscality', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['business_country' => 'DE']);
    expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-05'));

    $this->actingAs($user)
        ->getJson('/api/expenses')
        ->assertOk()
        ->assertJsonPath('projection', null)
        ->assertJsonPath('totals.count', 1);
});

test('never shows another account expenses', function (): void {
    $user = User::factory()->create();
    expenseOwnedBy(User::factory()->create(), fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-05'));

    $this->actingAs($user)
        ->getJson('/api/expenses')
        ->assertOk()
        ->assertJsonCount(0, 'expenses')
        ->assertJsonPath('totals.count', 0)
        ->assertJsonPath('categories', []);
});

test('refuses a month that does not exist', function (): void {
    $this->actingAs(User::factory()->create())
        ->getJson('/api/expenses?month=2026-13')
        ->assertUnprocessable()
        ->assertJsonValidationErrors('month');
});
