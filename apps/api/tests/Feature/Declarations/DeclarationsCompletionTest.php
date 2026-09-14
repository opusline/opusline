<?php

declare(strict_types=1);

use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Deadlines\Models\FiscalDeadlineCompletion;
use App\Domain\Expenses\Enums\ExpenseVatStatus;
use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

test('marking a return as filed answers the screen with the tick in place', function (): void {
    markDeclared(User::factory()->create(), FiscalDeadlineKind::UrssafDeclaration, '2026-07')
        ->assertCreated()
        ->assertJsonPath('period', '2026-07')
        ->assertJsonPath('urssaf.completion.declaredOn', '2026-08-13')
        ->assertJsonPath('urssaf.completion.paidOn', null)
        ->assertJsonPath('history.0.urssaf.completion.declaredOn', '2026-08-13');
});

test('a month well behind the échéances screen can still be marked', function (): void {
    // Two months back is as far as /deadlines shows; a late return still gets filed.
    markDeclared(User::factory()->create(), FiscalDeadlineKind::UrssafDeclaration, '2026-01', period: '2026-01')
        ->assertCreated()
        ->assertJsonPath('urssaf.completion.declaredOn', '2026-08-13');
});

test('answers the month the screen is on rather than the one the quarter ends in', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['urssaf_periodicity' => UrssafPeriodicity::Quarterly]);

    markDeclared($user, FiscalDeadlineKind::UrssafDeclaration, '2026-Q2', period: '2026-05')
        ->assertCreated()
        ->assertJsonPath('period', '2026-05')
        ->assertJsonPath('urssaf.period', '2026-Q2')
        ->assertJsonPath('urssaf.completion.declaredOn', '2026-08-13');
});

test('rejects a return the fiscal profile does not produce', function (): void {
    markDeclared(vatLiableUser(), FiscalDeadlineKind::VatCa12, '2026')
        ->assertNotFound();
});

test('a paid return carries both dates, and unmarking it forgets both', function (): void {
    $user = User::factory()->create();
    markDeclared($user, FiscalDeadlineKind::UrssafDeclaration, '2026-07')->assertCreated();

    $this->actingAs($user)
        ->postJson(completionPath(FiscalDeadlineKind::UrssafDeclaration, '2026-07', '/payment?period=2026-07'))
        ->assertCreated()
        ->assertJsonPath('urssaf.completion.declaredOn', '2026-08-13')
        ->assertJsonPath('urssaf.completion.paidOn', '2026-08-13');

    $this->actingAs($user)
        ->deleteJson(completionPath(FiscalDeadlineKind::UrssafDeclaration, '2026-07', '?period=2026-07'))
        ->assertOk()
        ->assertJsonPath('urssaf.completion', null);

    expect(FiscalDeadlineCompletion::query()->count())->toBe(0);
});

test('a payment cannot be recorded on a return not yet marked as filed', function (): void {
    $this->actingAs(User::factory()->create())
        ->postJson(completionPath(FiscalDeadlineKind::UrssafDeclaration, '2026-07', '/payment'))
        ->assertConflict()
        ->assertJsonPath('message', __('deadlines.not_completed'));
});

test('clearing a payment keeps the return filed', function (): void {
    $user = User::factory()->create();
    FiscalDeadlineCompletion::factory()->for($user)->of(FiscalDeadlineKind::UrssafDeclaration, '2026-07')
        ->completedOn('2026-08-10')->paidOn('2026-08-12')->create();

    // The screen answered is the one asked for, read from the query string.
    $this->actingAs($user)
        ->deleteJson(completionPath(FiscalDeadlineKind::UrssafDeclaration, '2026-07', '/payment?period=2026-06'))
        ->assertOk()
        ->assertJsonPath('period', '2026-06');

    $completion = $user->fiscalDeadlineCompletions()->sole();
    expect($completion->completed_on->toDateString())->toBe('2026-08-10')
        ->and($completion->paid_on)->toBeNull();
});

test('a second tick keeps the first filing date and the payment with it', function (): void {
    $user = User::factory()->create();
    FiscalDeadlineCompletion::factory()->for($user)->of(FiscalDeadlineKind::UrssafDeclaration, '2026-07')
        ->completedOn('2026-08-10')->paidOn('2026-08-12')->create();

    markDeclared($user, FiscalDeadlineKind::UrssafDeclaration, '2026-07')
        ->assertCreated()
        ->assertJsonPath('urssaf.completion.declaredOn', '2026-08-10')
        ->assertJsonPath('urssaf.completion.paidOn', '2026-08-12');
});

test('a tick on the running month writes nothing', function (): void {
    $user = User::factory()->create();

    markDeclared($user, FiscalDeadlineKind::UrssafDeclaration, '2026-07', period: '2026-08')
        ->assertUnprocessable()
        ->assertJsonValidationErrors('period');

    expect($user->fiscalDeadlineCompletions()->count())->toBe(0);
});

test('marking a CA3 as filed locks the month deductions on the journal', function (): void {
    $user = vatLiableUser();
    receiptedExpenseOwnedBy($user, fn ($factory) => $factory->on('2026-07-08')->ttc(120_000));

    markDeclared($user, FiscalDeadlineKind::VatCa3, '2026-07')
        ->assertCreated()
        ->assertJsonPath('vat.completion.declaredOn', '2026-08-13');

    $this->actingAs($user)
        ->getJson('/api/expenses?month=2026-07')
        ->assertOk()
        ->assertJsonPath('declaredOn', '2026-08-13')
        ->assertJsonPath('expenses.0.vatStatus', ExpenseVatStatus::Deducted->value);
});

test('the path rejects what the route constraints do not accept', function (string $kind, string $periodKey): void {
    $this->actingAs(User::factory()->create())
        ->deleteJson("/api/declarations/completions/{$kind}/{$periodKey}")
        ->assertNotFound();
})->with([
    'an unknown kind' => ['9', '2026-07'],
    'a month that does not exist' => ['0', '2026-13'],
]);

test('rejects a malformed period key in the body', function (): void {
    markDeclared(User::factory()->create(), FiscalDeadlineKind::UrssafDeclaration, '2026/07')->assertUnprocessable();
});

test('never touches another account ticks', function (): void {
    $other = User::factory()->create();
    FiscalDeadlineCompletion::factory()->for($other)->of(FiscalDeadlineKind::UrssafDeclaration, '2026-07')->create();

    $this->actingAs(User::factory()->create())
        ->deleteJson(completionPath(FiscalDeadlineKind::UrssafDeclaration, '2026-07'))
        ->assertOk();

    expect($other->fiscalDeadlineCompletions()->count())->toBe(1);
});

test('requires authentication', function (): void {
    $this->postJson('/api/declarations/completions', ['kind' => 0, 'periodKey' => '2026-07'])->assertUnauthorized();
});
