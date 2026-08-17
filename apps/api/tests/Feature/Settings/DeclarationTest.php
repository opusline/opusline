<?php

declare(strict_types=1);

use App\Domain\Settings\Enums\FiscalDeadlineKind;
use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Settings\Models\FiscalDeclaration;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

/** Today is frozen at 2026-08-13 for every test in this file. */
function monthlyUrssafUser(): User
{
    $user = User::factory()->create();
    $user->settings()->sole()->update(['urssaf_periodicity' => UrssafPeriodicity::Monthly]);

    return $user;
}

function declarationFor(array $rows, string $period, int $kind = 1): ?array
{
    return collect($rows)->firstWhere(
        fn (array $row): bool => $row['kind'] === $kind && $row['period'] === $period,
    );
}

test('requires authentication', function (): void {
    $this->getJson('/api/declarations')->assertUnauthorized();
});

test('lists every period as unfiled until one is recorded', function (): void {
    $rows = $this->actingAs(monthlyUrssafUser())
        ->getJson('/api/declarations')
        ->assertOk()
        ->json('declarations');

    expect(collect($rows)->every(fn (array $row): bool => $row['isFiled'] === false))->toBeTrue();
});

test('shows the same figure the deadlines screen shows', function (): void {
    $user = monthlyUrssafUser();
    $user->settings()->sole()->update(['contribution_rate_bp' => 2600]);

    invoiceOwnedBy($user, configure: fn ($factory) => $factory->paid()->state([
        'issued_on' => '2026-07-02',
        'paid_on' => '2026-07-20',
        'amount_ht_cents' => 1_000_000,
    ]));

    $deadline = collect(
        $this->actingAs($user)->getJson('/api/fiscal-deadlines')->json('deadlines'),
    )->firstWhere(fn (array $row): bool => $row['kind'] === 1 && $row['period'] === '2026-07');

    $declaration = declarationFor(
        $this->actingAs($user)->getJson('/api/declarations')->json('declarations'),
        '2026-07',
    );

    // Both read ListFiscalDeadlines, so they cannot drift apart.
    expect($declaration['amount'])->toBe($deadline['amount'])
        ->and($declaration['dueOn'])->toBe($deadline['dueOn']);
});

test('records a filing and stops asking for that period', function (): void {
    $user = monthlyUrssafUser();

    $rows = $this->actingAs($user)
        ->postJson('/api/declarations', [
            'kind' => FiscalDeadlineKind::Urssaf->value,
            'period' => '2026-07',
            'filedOn' => '2026-08-12',
        ])
        ->assertCreated()
        ->json('declarations');

    $july = declarationFor($rows, '2026-07');

    expect($july['isFiled'])->toBeTrue()
        ->and($july['filedOn'])->toBe('2026-08-12')
        ->and($july['isLate'])->toBeFalse();
});

test('keeps what was actually declared when it differs from the computed figure', function (): void {
    $user = monthlyUrssafUser();

    $rows = $this->actingAs($user)
        ->postJson('/api/declarations', [
            'kind' => FiscalDeadlineKind::Urssaf->value,
            'period' => '2026-07',
            'declaredAmount' => ['amount' => 251_300, 'currency' => 'EUR'],
        ])
        ->assertCreated()
        ->json('declarations');

    expect(declarationFor($rows, '2026-07')['declaredAmount']['amount'])->toBe(251_300);
});

test('corrects a filing rather than duplicating it', function (): void {
    $user = monthlyUrssafUser();
    $payload = [
        'kind' => FiscalDeadlineKind::Urssaf->value,
        'period' => '2026-07',
    ];

    $this->actingAs($user)->postJson('/api/declarations', [...$payload, 'filedOn' => '2026-08-05'])->assertCreated();
    $rows = $this->actingAs($user)
        ->postJson('/api/declarations', [...$payload, 'filedOn' => '2026-08-12'])
        ->assertCreated()
        ->json('declarations');

    expect(declarationFor($rows, '2026-07')['filedOn'])->toBe('2026-08-12')
        ->and(FiscalDeclaration::query()->where('period', '2026-07')->count())->toBe(1);
});

test('calls an unfiled period past its date late', function (): void {
    // June's URSSAF was due 31 July; today is 13 August and nothing was filed.
    $rows = $this->actingAs(monthlyUrssafUser())
        ->getJson('/api/declarations')
        ->assertOk()
        ->json('declarations');

    expect(declarationFor($rows, '2026-06')['isLate'])->toBeTrue();
});

test('stops calling a period late once it is filed', function (): void {
    $user = monthlyUrssafUser();

    $rows = $this->actingAs($user)
        ->postJson('/api/declarations', [
            'kind' => FiscalDeadlineKind::Urssaf->value,
            'period' => '2026-06',
        ])
        ->assertCreated()
        ->json('declarations');

    expect(declarationFor($rows, '2026-06')['isLate'])->toBeFalse();
});

test('refuses a filing dated in the future', function (): void {
    $this->actingAs(monthlyUrssafUser())
        ->postJson('/api/declarations', [
            'kind' => FiscalDeadlineKind::Urssaf->value,
            'period' => '2026-07',
            'filedOn' => '2026-09-01',
        ])
        ->assertJsonValidationErrorFor('filedOn');
});

test('refuses a period that is not a month or a quarter', function (): void {
    $this->actingAs(monthlyUrssafUser())
        ->postJson('/api/declarations', [
            'kind' => FiscalDeadlineKind::Urssaf->value,
            'period' => '2026-13',
        ])
        ->assertJsonValidationErrorFor('period');
});

test('never shows another account filings', function (): void {
    $stranger = monthlyUrssafUser();
    FiscalDeclaration::factory()->for($stranger)->create(['period' => '2026-07']);

    $rows = $this->actingAs(monthlyUrssafUser())
        ->getJson('/api/declarations')
        ->assertOk()
        ->json('declarations');

    expect(declarationFor($rows, '2026-07')['isFiled'])->toBeFalse();
});
