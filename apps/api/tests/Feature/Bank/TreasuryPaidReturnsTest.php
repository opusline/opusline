<?php

declare(strict_types=1);

use App\Domain\Bank\Factories\BankMovementFactory;
use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Deadlines\Models\FiscalDeadlineCompletion;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

/**
 * July's URSSAF filed and still carried — 1 650 € HT collected at 25 % plus
 * the 0,2 % CFP, 415,80 € — on a balance confirmed by hand on 10 August, so
 * anything dated after that is invisible to it.
 */
function accountWithJulyUrssafFiled(): User
{
    $user = accountWithBankBalance('2026-08-10', 1_000_000);
    $user->settings()->sole()->update(['business_country' => 'FR', 'contribution_rate_bp' => 2500]);
    paidInvoiceOn($user, '2026-07-31');
    FiscalDeadlineCompletion::factory()->for($user)
        ->of(FiscalDeadlineKind::UrssafDeclaration, '2026-07')
        ->completedOn('2026-08-12')
        ->create();

    return $user;
}

test('marking a return paid moves its amount out of the provisions without moving the transferable amount', function (): void {
    $user = accountWithJulyUrssafFiled();
    $before = $this->actingAs($user)->getJson('/api/treasury')->assertOk();

    $this->actingAs($user)
        ->postJson(completionPath(FiscalDeadlineKind::UrssafDeclaration, '2026-07', '/payment'))
        ->assertCreated();

    $this->actingAs($user)
        ->getJson('/api/treasury')
        ->assertOk()
        ->assertJsonPath('provisions.urssaf.carried.amount', 0)
        ->assertJsonPath('provisions.urssaf.paidPeriods.0.period', '2026-07')
        ->assertJsonPath('provisions.urssaf.paidPeriods.0.amount.amount', 41_580)
        ->assertJsonPath('provisions.urssaf.paidPeriods.0.paidOn', '2026-08-13')
        ->assertJsonPath('pendingDeclarations.amount', 41_580)
        ->assertJsonPath('transferable.amount', $before->json('transferable.amount'));
});

test('stops deducting a paid return once the balance covers the day it was paid', function (): void {
    $user = accountWithJulyUrssafFiled();
    FiscalDeadlineCompletion::query()->where('user_id', $user->id)->update(['paid_on' => '2026-08-11']);
    bankMovementFor($user, configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->debit(41_580)->on('2026-08-12'));

    $this->actingAs($user)
        ->getJson('/api/treasury')
        ->assertOk()
        ->assertJsonPath('coveredThrough', '2026-08-12')
        ->assertJsonPath('pendingDeclarations.amount', 0);
});

test('stops deducting a paid return once its debit is detected, whatever day it was marked', function (): void {
    $user = accountWithJulyUrssafFiled();
    FiscalDeadlineCompletion::query()->where('user_id', $user->id)->update(['paid_on' => '2026-08-13']);
    fiscDebitOn($user, '2026-08-05', 41_580, 'PRLV URSSAF JUILLET');

    $this->actingAs($user)
        ->getJson('/api/treasury')
        ->assertOk()
        ->assertJsonPath('provisions.urssaf.paidPeriods', [])
        ->assertJsonPath('pendingDeclarations.amount', 0);
});

test('deducts a paid cfe at what it had accrued until its debit shows up', function (): void {
    $user = accountWithBankBalance('2026-08-10', 1_000_000);
    $user->settings()->sole()->update(['business_country' => 'FR', 'cfe_expected_cents' => 48_000]);
    FiscalDeadlineCompletion::factory()->for($user)->of(FiscalDeadlineKind::Cfe, '2026')->completedOn('2026-08-12')->create();
    $before = $this->actingAs($user)->getJson('/api/treasury')->assertOk();

    $this->actingAs($user)
        ->postJson(completionPath(FiscalDeadlineKind::Cfe, '2026', '/payment?period=2026-07'))
        ->assertCreated();

    $this->actingAs($user)
        ->getJson('/api/treasury')
        ->assertOk()
        ->assertJsonPath('provisions.cfe.amount.amount', 0)
        // Eight elapsed twelfths of the 480 € expected.
        ->assertJsonPath('pendingDeclarations.amount', 32_000)
        ->assertJsonPath('transferable.amount', $before->json('transferable.amount'));
});

test('takes a paid return the balance does not show yet off the balance before the provisions', function (): void {
    $user = accountWithJulyUrssafFiled();
    FiscalDeadlineCompletion::query()->where('user_id', $user->id)->update(['paid_on' => '2026-08-13']);
    $treasury = $this->actingAs($user)->getJson('/api/treasury')->assertOk();

    expect($treasury->json('pendingDeclarations.amount'))->toBe(41_580)
        ->and($treasury->json('transferable.amount'))
        ->toBe($treasury->json('balance.amount.amount') - 41_580 - $treasury->json('provisions.total.amount'));
});
