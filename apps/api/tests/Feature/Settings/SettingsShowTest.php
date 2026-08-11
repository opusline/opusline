<?php

declare(strict_types=1);

use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Users\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('returns the seeded defaults for a fresh account', function (): void {
    $this->actingAs(User::factory()->create())
        ->getJson('/api/settings')
        ->assertOk()
        ->assertJsonPath('tradeName', null)
        ->assertJsonPath('homeAddressSameAsCompany', true)
        ->assertJsonPath('urssafPeriodicity', UrssafPeriodicity::Monthly->value)
        ->assertJsonPath('contributionRateBp', 2600)
        ->assertJsonPath('liberatingPayment', false)
        ->assertJsonPath('liberatingPaymentRateBp', 220)
        ->assertJsonPath('vatRegime', VatRegime::FranchiseEnBase->value)
        ->assertJsonPath('defaultPaymentTermsDays', 45)
        ->assertJsonPath('invoiceNumberFormat', 'AAAA-NNN')
        ->assertJsonPath('treasuryBuffer', null)
        ->assertJsonPath('hasSignature', false);
});

test('derives the vat liability from the regime', function (VatRegime $regime, bool $expected): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['vat_regime' => $regime]);

    $this->actingAs($user)
        ->getJson('/api/settings')
        ->assertOk()
        ->assertJsonPath('vatLiable', $expected);
})->with([
    'franchise en base' => [VatRegime::FranchiseEnBase, false],
    'réel simplifié' => [VatRegime::ReelSimplifie, true],
    'réel normal' => [VatRegime::ReelNormal, true],
]);

test('adds the versement libératoire to the effective contribution rate', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update([
        'contribution_rate_bp' => 2600,
        'liberating_payment' => true,
        'liberating_payment_rate_bp' => 220,
    ]);

    $this->actingAs($user)
        ->getJson('/api/settings')
        ->assertOk()
        ->assertJsonPath('effectiveContributionRateBp', 2820);
});

test('leaves the effective rate alone when the versement libératoire is off', function (): void {
    $this->actingAs(User::factory()->create())
        ->getJson('/api/settings')
        ->assertOk()
        ->assertJsonPath('effectiveContributionRateBp', 2600);
});

test('reports a stored signature', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $this->actingAs($user)
        ->post('/api/user/signature', ['signature' => UploadedFile::fake()->image('signature.png')]);

    $this->actingAs($user)
        ->getJson('/api/settings')
        ->assertOk()
        ->assertJsonPath('hasSignature', true);
});

test('never returns another account settings', function (): void {
    $other = User::factory()->create();
    $other->settings()->sole()->update(['trade_name' => 'Nordlys']);

    $this->actingAs(User::factory()->create())
        ->getJson('/api/settings')
        ->assertOk()
        ->assertJsonPath('tradeName', null);
});

test('returns 401 for guests', function (): void {
    $this->getJson('/api/settings')->assertUnauthorized();
});
