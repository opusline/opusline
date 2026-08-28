<?php

declare(strict_types=1);

use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

test('ticking a deadline off moves on to the next one', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/deadlines/completions', [
            'kind' => FiscalDeadlineKind::UrssafDeclaration->value,
            'periodKey' => '2026-05',
        ])
        ->assertCreated()
        ->assertJsonPath('next.fiscal.periodKey', '2026-06');

    $completed = collect($this->actingAs($user)->getJson('/api/deadlines')->json('items'))
        ->pluck('fiscal')
        ->filter()
        ->firstWhere(fn (array $deadline): bool => $deadline['kind'] === FiscalDeadlineKind::UrssafDeclaration->value
            && $deadline['periodKey'] === '2026-05');

    // It stays on the list with the day it was settled, rather than vanishing.
    expect($completed['completedOn'])->toBe('2026-08-13');
});

test('dates a tick by the account calendar, not the server clock', function (): void {
    $user = User::factory()->create();
    // 13 August 12:00 UTC is already the 14th in Auckland.
    $user->settings()->sole()->update(['timezone' => 'Pacific/Auckland']);

    $this->actingAs($user->fresh())
        ->postJson('/api/deadlines/completions', [
            'kind' => FiscalDeadlineKind::UrssafDeclaration->value,
            'periodKey' => '2026-05',
        ])
        ->assertCreated();

    $completed = collect($this->actingAs($user->fresh())->getJson('/api/deadlines')->json('items'))
        ->pluck('fiscal')
        ->filter()
        ->firstWhere('periodKey', '2026-05');

    expect($completed['completedOn'])->toBe('2026-08-14');
});

test('unticking puts it back on the list', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)->postJson('/api/deadlines/completions', [
        'kind' => FiscalDeadlineKind::UrssafDeclaration->value,
        'periodKey' => '2026-05',
    ])->assertCreated();

    $this->actingAs($user)
        ->deleteJson('/api/deadlines/completions/'.FiscalDeadlineKind::UrssafDeclaration->value.'/2026-05')
        ->assertOk()
        ->assertJsonPath('next.fiscal.periodKey', '2026-05');
});

test('ticking the same deadline twice changes nothing', function (): void {
    $user = User::factory()->create();

    foreach (range(1, 2) as $ignored) {
        $this->actingAs($user)->postJson('/api/deadlines/completions', [
            'kind' => FiscalDeadlineKind::UrssafDeclaration->value,
            'periodKey' => '2026-05',
        ])->assertCreated();
    }

    expect($user->fiscalDeadlineCompletions()->count())->toBe(1);
});

test('rejects a deadline the account profile does not produce', function (): void {
    $user = User::factory()->create();

    // The franchise en base files no CA3, whatever the period.
    $this->actingAs($user)
        ->postJson('/api/deadlines/completions', [
            'kind' => FiscalDeadlineKind::VatCa3->value,
            'periodKey' => '2026-07',
        ])
        ->assertNotFound();

    expect($user->fiscalDeadlineCompletions()->count())->toBe(0);
});

test('rejects a period outside the window in play', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/deadlines/completions', [
            'kind' => FiscalDeadlineKind::UrssafDeclaration->value,
            'periodKey' => '2019-03',
        ])
        ->assertNotFound();
});

test('rejects a malformed period key', function (string $periodKey): void {
    $this->actingAs(User::factory()->create())
        ->postJson('/api/deadlines/completions', [
            'kind' => FiscalDeadlineKind::UrssafDeclaration->value,
            'periodKey' => $periodKey,
        ])
        ->assertJsonValidationErrorFor('periodKey');
})->with([
    'a month that does not exist' => ['2026-13'],
    'a quarter that does not exist' => ['2026-Q5'],
    'free text' => ['july'],
    'a full date' => ['2026-07-31'],
]);

test('rejects an unknown kind', function (): void {
    $this->actingAs(User::factory()->create())
        ->postJson('/api/deadlines/completions', ['kind' => 99, 'periodKey' => '2026-07'])
        ->assertJsonValidationErrorFor('kind');
});

test('never reaches another account deadlines', function (): void {
    $owner = User::factory()->create();
    $stranger = User::factory()->create();

    $this->actingAs($owner)->postJson('/api/deadlines/completions', [
        'kind' => FiscalDeadlineKind::UrssafDeclaration->value,
        'periodKey' => '2026-05',
    ])->assertCreated();

    $this->actingAs($stranger)
        ->getJson('/api/deadlines')
        ->assertOk()
        ->assertJsonPath('next.fiscal.periodKey', '2026-05');

    expect($owner->fiscalDeadlineCompletions()->count())->toBe(1);
});
