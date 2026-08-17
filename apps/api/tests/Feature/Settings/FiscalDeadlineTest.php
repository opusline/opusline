<?php

declare(strict_types=1);

use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

/** Today is frozen at 2026-08-13 for every test in this file. */
test('requires authentication', function (): void {
    $this->getJson('/api/fiscal-deadlines')->assertUnauthorized();
});

test('lists nothing for a business outside France', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['business_country' => 'BE']);

    $this->actingAs($user)
        ->getJson('/api/fiscal-deadlines')
        ->assertOk()
        ->assertJsonPath('deadlines', [])
        ->assertJsonPath('hasUncomputedVatSchedule', false);
});

test('puts the URSSAF payment on the last day of the following month', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['urssaf_periodicity' => UrssafPeriodicity::Monthly]);

    $july = collect(
        $this->actingAs($user)->getJson('/api/fiscal-deadlines')->assertOk()->json('deadlines'),
    )->firstWhere(fn (array $row): bool => $row['kind'] === 1 && $row['period'] === '2026-07');

    expect($july['dueOn'])->toBe('2026-08-31');
});

test('puts the TVA return on the fifteenth of the following month', function (): void {
    $user = User::factory()->create();
    vatLiable($user, 2000);

    $july = collect(
        $this->actingAs($user)->getJson('/api/fiscal-deadlines')->assertOk()->json('deadlines'),
    )->firstWhere(fn (array $row): bool => $row['kind'] === 0 && $row['period'] === '2026-07');

    expect($july['dueOn'])->toBe('2026-08-15');
});

test('declares no TVA under the franchise en base', function (): void {
    $user = User::factory()->create();

    $kinds = collect(
        $this->actingAs($user)->getJson('/api/fiscal-deadlines')->assertOk()->json('deadlines'),
    )->pluck('kind')->unique()->values();

    expect($kinds->all())->toBe([1]);
});

test('says the annual CA12 schedule is not computed', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['vat_regime' => VatRegime::ReelSimplifie]);

    // Its statutory date follows the income-tax season, not the period, so
    // Opusline says so rather than inventing one.
    $this->actingAs($user)
        ->getJson('/api/fiscal-deadlines')
        ->assertOk()
        ->assertJsonPath('hasUncomputedVatSchedule', true);
});

test('owes URSSAF on what was collected in the period', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update([
        'urssaf_periodicity' => UrssafPeriodicity::Monthly,
        'contribution_rate_bp' => 2600,
    ]);

    invoiceOwnedBy($user, configure: fn ($factory) => $factory->paid()->state([
        'issued_on' => '2026-07-02',
        'paid_on' => '2026-07-20',
        'amount_ht_cents' => 1_000_000,
    ]));

    $july = collect(
        $this->actingAs($user)->getJson('/api/fiscal-deadlines')->assertOk()->json('deadlines'),
    )->firstWhere(fn (array $row): bool => $row['kind'] === 1 && $row['period'] === '2026-07');

    expect($july['amount']['amount'])->toBe(260_000);
});

test('withholds the figure for a period still running', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['urssaf_periodicity' => UrssafPeriodicity::Monthly]);

    invoiceOwnedBy($user, configure: fn ($factory) => $factory->paid()->state([
        'issued_on' => '2026-08-02',
        'paid_on' => '2026-08-10',
        'amount_ht_cents' => 1_000_000,
    ]));

    // August is not over, so its total is not the one to declare yet.
    $august = collect(
        $this->actingAs($user)->getJson('/api/fiscal-deadlines')->assertOk()->json('deadlines'),
    )->firstWhere(fn (array $row): bool => $row['kind'] === 1 && $row['period'] === '2026-08');

    expect($august['amount'])->toBeNull();
});

test('counts a past-due period as overdue', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['urssaf_periodicity' => UrssafPeriodicity::Monthly]);

    // June's URSSAF was due 31 July; today is 13 August.
    $june = collect(
        $this->actingAs($user)->getJson('/api/fiscal-deadlines')->assertOk()->json('deadlines'),
    )->firstWhere(fn (array $row): bool => $row['kind'] === 1 && $row['period'] === '2026-06');

    expect($june['isOverdue'])->toBeTrue()
        ->and($june['daysUntilDue'])->toBeLessThan(0);
});

test('counts the days left on a deadline still ahead', function (): void {
    $user = User::factory()->create();
    vatLiable($user, 2000);

    // July's CA3 is due 15 August; today is 13 August.
    $july = collect(
        $this->actingAs($user)->getJson('/api/fiscal-deadlines')->assertOk()->json('deadlines'),
    )->firstWhere(fn (array $row): bool => $row['kind'] === 0 && $row['period'] === '2026-07');

    expect($july['daysUntilDue'])->toBe(2)
        ->and($july['isOverdue'])->toBeFalse();
});

test('groups URSSAF by quarter when the account declares quarterly', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['urssaf_periodicity' => UrssafPeriodicity::Quarterly]);

    $periods = collect(
        $this->actingAs($user)->getJson('/api/fiscal-deadlines')->assertOk()->json('deadlines'),
    )->where('kind', 1)->pluck('period');

    expect($periods->every(fn (string $period): bool => str_contains($period, '-Q')))->toBeTrue();
});

test('lists deadlines soonest first', function (): void {
    $user = User::factory()->create();
    vatLiable($user, 2000);

    $dates = collect(
        $this->actingAs($user)->getJson('/api/fiscal-deadlines')->assertOk()->json('deadlines'),
    )->pluck('dueOn');

    expect($dates->all())->toBe($dates->sort()->values()->all());
});
