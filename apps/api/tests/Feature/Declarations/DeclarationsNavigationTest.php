<?php

declare(strict_types=1);

use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

test('opens on the most recently closed month with no way forward', function (): void {
    $this->actingAs(User::factory()->create())
        ->getJson('/api/declarations')
        ->assertOk()
        ->assertJsonPath('period', '2026-07')
        ->assertJsonPath('previousPeriod', '2026-06')
        ->assertJsonPath('nextPeriod', null)
        ->assertJsonPath('isDefault', true);
});

test('shows an earlier month on request, with both neighbours', function (): void {
    $user = User::factory()->create();
    paidInvoiceOn($user, '2026-05-12');

    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-05')
        ->assertOk()
        ->assertJsonPath('period', '2026-05')
        ->assertJsonPath('previousPeriod', '2026-04')
        ->assertJsonPath('nextPeriod', '2026-06')
        ->assertJsonPath('isDefault', false)
        ->assertJsonPath('urssaf.period', '2026-05')
        ->assertJsonPath('urssaf.base.amount', 165_000);
});

test('refuses the running month and anything later', function (string $period): void {
    $this->actingAs(User::factory()->create())
        ->getJson("/api/declarations?period={$period}")
        ->assertUnprocessable()
        ->assertJsonValidationErrors('period');
})->with(['the running month' => ['2026-08'], 'next month' => ['2026-09'], 'next year' => ['2027-01']]);

test('refuses a period that is not a civil month', function (): void {
    $this->actingAs(User::factory()->create())
        ->getJson('/api/declarations?period=2026-Q2')
        ->assertUnprocessable()
        ->assertJsonValidationErrors('period');
});

test('resolves the last closed quarter for a quarterly account', function (string $period, string $quarter, bool $covers): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['urssaf_periodicity' => UrssafPeriodicity::Quarterly]);
    paidInvoiceOn($user, '2026-04-12');
    paidInvoiceOn($user, '2026-06-30');

    $this->actingAs($user)
        ->getJson("/api/declarations?period={$period}")
        ->assertOk()
        ->assertJsonPath('urssaf.period', $quarter)
        ->assertJsonPath('urssaf.coversShownMonth', $covers)
        ->assertJsonPath('urssaf.base.amount', 330_000)
        ->assertJsonPath('urssaf.invoiceCount', 2);
})->with([
    'a month inside a closed quarter' => ['2026-05', '2026-Q2', true],
    // July sits in Q3, which is still running on 13 August: Q2 is what can be filed.
    'a month inside the running quarter' => ['2026-07', '2026-Q2', false],
]);

test('keeps the deadline of a quarter stepped back behind the shown month', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['urssaf_periodicity' => UrssafPeriodicity::Quarterly]);

    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('urssaf.period', '2026-Q2')
        ->assertJsonPath('urssaf.deadline.dueOn', '2026-07-31')
        ->assertJsonPath('urssaf.deadline.daysLeft', -13);
});

test('carries the deadline and the tick for each block', function (): void {
    $user = User::factory()->create();
    vatLiable($user);
    ca3DeclaredFor($user, '2026-07', '2026-08-10');

    $this->actingAs($user)
        ->getJson('/api/declarations')
        ->assertOk()
        ->assertJsonPath('urssaf.deadline.dueOn', '2026-08-31')
        ->assertJsonPath('urssaf.deadline.daysLeft', 18)
        ->assertJsonPath('urssaf.completion', null)
        ->assertJsonPath('vat.deadline.dueOn', '2026-08-17')
        ->assertJsonPath('vat.deadline.daysLeft', 4)
        ->assertJsonPath('vat.completion.declaredOn', '2026-08-10');
});

test('has no deadline for a month the business did not exist in', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['business_started_on' => '2026-06-01']);

    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-03')
        ->assertOk()
        ->assertJsonPath('urssaf.deadline', null)
        ->assertJsonPath('urssaf.base.amount', 0);
});
