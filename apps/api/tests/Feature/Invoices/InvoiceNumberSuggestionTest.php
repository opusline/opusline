<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

/**
 * @param  list<string>  $existing
 */
test('suggests the next number for the current period', function (array $existing, string $format, string $expected): void {
    $this->travelTo(CarbonImmutable::parse('2026-08-13'));

    $user = User::factory()->create();
    $user->settings()->sole()->update(['invoice_number_format' => $format]);

    foreach ($existing as $number) {
        invoiceOwnedBy($user, configure: fn ($factory) => $factory->state(['number' => $number]));
    }

    $this->actingAs($user)
        ->getJson('/api/invoices/next-number')
        ->assertOk()
        ->assertJsonPath('number', $expected);
})->with([
    'first of the year' => [[], 'AAAA-NNN', '2026-001'],
    'continues from the highest' => [['2026-007', '2026-003'], 'AAAA-NNN', '2026-008'],
    'restarts on a new period' => [['2025-042'], 'AAAA-NNN', '2026-001'],
    'monthly format' => [['F-2026-07-009'], 'F-AAAA-MM-NNN', 'F-2026-08-001'],
    'ignores a reference in another shape' => [['SHINE/AOUT/12'], 'AAAA-NNN', '2026-001'],
    'counts past the padded width' => [['2026-999'], 'AAAA-NNN', '2026-1000'],
    'leaves a literal containing MM alone' => [[], 'COMMANDE-NNN', 'COMMANDE-001'],
    'leaves a literal containing NNN alone' => [[], 'ANNNA-NNN', 'ANNNA-001'],
    'renders tokens written back to back' => [[], 'AAAAMM-NNN', '202608-001'],
]);

test('returns the format the suggestion was built from', function (): void {
    $this->actingAs(User::factory()->create())
        ->getJson('/api/invoices/next-number')
        ->assertOk()
        ->assertJsonPath('format', 'AAAA-NNN');
});
