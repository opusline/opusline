<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

test('saves the bank details and the trade registry printed on documents', function (): void {
    $this->actingAs(User::factory()->create())
        ->putJson('/api/settings', settingsPayload([
            'iban' => 'fr76 3000 6000 0112 3456 7890 189',
            'bic' => ' agrifrpp ',
            'tradeRegistry' => 'RCS Lyon 123 456 789',
        ]))
        ->assertOk()
        ->assertJsonPath('iban', 'FR7630006000011234567890189')
        ->assertJsonPath('bic', 'AGRIFRPP')
        ->assertJsonPath('tradeRegistry', 'RCS Lyon 123 456 789');
});

test('stores the iban encrypted', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)->putJson('/api/settings', settingsPayload(['iban' => 'FR7630006000011234567890189']));

    $stored = DB::table('user_settings')->where('user_id', $user->id)->value('iban');
    expect($stored)->not->toBeNull()->not->toContain('FR76');
});

test('clears the bank details', function (): void {
    $user = User::factory()->create();
    $this->actingAs($user)->putJson('/api/settings', settingsPayload(['iban' => 'FR7630006000011234567890189', 'bic' => 'AGRIFRPP']));

    $this->actingAs($user)
        ->putJson('/api/settings', settingsPayload())
        ->assertOk()
        ->assertJsonPath('iban', null)
        ->assertJsonPath('bic', null);
});

test('refuses an iban whose check digits do not add up', function (string $iban): void {
    $this->actingAs(User::factory()->create())
        ->putJson('/api/settings', settingsPayload(['iban' => $iban]))
        ->assertJsonValidationErrorFor('iban');
})->with([
    'wrong check digits' => 'FR7730006000011234567890189',
    'too short' => 'FR76300060',
    'not an iban' => 'not an iban',
]);

test('refuses a bic that is not 8 or 11 characters', function (string $bic): void {
    $this->actingAs(User::factory()->create())
        ->putJson('/api/settings', settingsPayload(['bic' => $bic]))
        ->assertJsonValidationErrorFor('bic');
})->with(['AGRIFR', 'AGRIFRPP1', '12RIFRPP']);
