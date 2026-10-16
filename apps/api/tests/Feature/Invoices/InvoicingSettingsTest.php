<?php

declare(strict_types=1);

use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Enums\InvoicingMode;
use App\Domain\Invoices\Enums\OperationCategory;
use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Users\Models\User;

function invoicingSettingsPayload(array $overrides = []): array
{
    return array_merge([
        'mode' => InvoicingMode::Opusline->value,
        'defaultPaymentTermsDays' => 30,
        'defaultPaymentTermsEndOfMonth' => false,
        'quoteValidityDays' => 30,
        'operationCategory' => OperationCategory::Services->value,
        'showIbanOnInvoices' => true,
        'showEmailOnDocuments' => true,
        'vatOnDebits' => false,
        'documentLanguage' => DocumentLanguage::French->value,
        'latePenaltyRateBp' => null,
        'customMentions' => null,
    ], $overrides);
}

test('starts a fresh account on the recording flow and the statutory penalty rate', function (): void {
    $this->actingAs(User::factory()->create())
        ->getJson('/api/invoicing/settings')
        ->assertOk()
        ->assertJsonPath('mode', InvoicingMode::Elsewhere->value)
        ->assertJsonPath('defaultPaymentTermsDays', 45)
        ->assertJsonPath('defaultPaymentTermsEndOfMonth', false)
        ->assertJsonPath('quoteValidityDays', 30)
        ->assertJsonPath('latePenaltyRateBp', null)
        ->assertJsonPath('operationCategory', OperationCategory::Services->value)
        ->assertJsonPath('documentLanguage', DocumentLanguage::French->value);
});

test('carries the legal reference the penalty hints are computed from', function (): void {
    config()->set('invoicing.legal_reference.legal_interest_rate_bp', 275);
    config()->set('invoicing.legal_reference.ecb_rate_bp', 240);

    $this->actingAs(User::factory()->create())
        ->getJson('/api/invoicing/settings')
        ->assertJsonPath('legalReference.minimumPenaltyRateBp', 825)
        ->assertJsonPath('legalReference.statutoryPenaltyRateBp', 1240)
        ->assertJsonPath('legalReference.recoveryFee.amount', 4000)
        ->assertJsonPath('legalReference.recoveryFee.currency', 'EUR');
});

test('saves the defaults of new invoices and quotes', function (): void {
    $this->actingAs(User::factory()->create())
        ->putJson('/api/invoicing/settings', invoicingSettingsPayload([
            'defaultPaymentTermsDays' => 45,
            'defaultPaymentTermsEndOfMonth' => true,
            'quoteValidityDays' => 60,
            'latePenaltyRateBp' => 1240,
            'operationCategory' => OperationCategory::Mixed->value,
            'showIbanOnInvoices' => false,
            'customMentions' => "  Membre d'une association agréée.  ",
            'documentLanguage' => DocumentLanguage::English->value,
        ]))
        ->assertOk()
        ->assertJsonPath('mode', InvoicingMode::Opusline->value)
        ->assertJsonPath('defaultPaymentTermsDays', 45)
        ->assertJsonPath('defaultPaymentTermsEndOfMonth', true)
        ->assertJsonPath('quoteValidityDays', 60)
        ->assertJsonPath('latePenaltyRateBp', 1240)
        ->assertJsonPath('operationCategory', OperationCategory::Mixed->value)
        ->assertJsonPath('showIbanOnInvoices', false)
        ->assertJsonPath('customMentions', "Membre d'une association agréée.")
        ->assertJsonPath('documentLanguage', DocumentLanguage::English->value);
});

test('reads the payment terms back on the general settings too', function (): void {
    $user = User::factory()->create();
    $this->actingAs($user)->putJson('/api/invoicing/settings', invoicingSettingsPayload(['defaultPaymentTermsDays' => 15]));

    $this->actingAs($user)->getJson('/api/settings')->assertJsonPath('defaultPaymentTermsDays', 15);
});

test('caps the payment terms at the legal maximum', function (int $days, bool $endOfMonth): void {
    $this->actingAs(User::factory()->create())
        ->putJson('/api/invoicing/settings', invoicingSettingsPayload([
            'defaultPaymentTermsDays' => $days,
            'defaultPaymentTermsEndOfMonth' => $endOfMonth,
        ]))
        ->assertJsonValidationErrorFor('defaultPaymentTermsDays');
})->with([
    '61 days net' => [61, false],
    '46 days end of month' => [46, true],
    'negative' => [-1, false],
]);

test('accepts the legal maximums', function (int $days, bool $endOfMonth): void {
    $this->actingAs(User::factory()->create())
        ->putJson('/api/invoicing/settings', invoicingSettingsPayload([
            'defaultPaymentTermsDays' => $days,
            'defaultPaymentTermsEndOfMonth' => $endOfMonth,
        ]))
        ->assertOk();
})->with([
    '60 days net' => [60, false],
    '45 days end of month' => [45, true],
    'end of month itself' => [0, true],
]);

test('keeps a longer term saved before the legal cap while it is left unchanged', function (): void {
    $user = User::factory()->create();
    $user->settingsOrFail()->update(['default_payment_terms_days' => 90]);

    $this->actingAs($user)
        ->putJson('/api/invoicing/settings', invoicingSettingsPayload([
            'defaultPaymentTermsDays' => 90,
            'quoteValidityDays' => 60,
        ]))
        ->assertOk()
        ->assertJsonPath('defaultPaymentTermsDays', 90)
        ->assertJsonPath('quoteValidityDays', 60);
});

test('still caps a longer term saved before the legal cap once it changes', function (int $days, bool $endOfMonth): void {
    $user = User::factory()->create();
    $user->settingsOrFail()->update(['default_payment_terms_days' => 90]);

    $this->actingAs($user)
        ->putJson('/api/invoicing/settings', invoicingSettingsPayload([
            'defaultPaymentTermsDays' => $days,
            'defaultPaymentTermsEndOfMonth' => $endOfMonth,
        ]))
        ->assertJsonValidationErrorFor('defaultPaymentTermsDays');
})->with([
    'another illegal term' => [61, false],
    'the same days from the end of the month' => [90, true],
]);

test('keeps invoicing settings isolated between accounts', function (): void {
    $other = User::factory()->create();
    $other->settingsOrFail()->update(['quote_validity_days' => 30]);

    $this->actingAs(User::factory()->create())
        ->putJson('/api/invoicing/settings', invoicingSettingsPayload(['quoteValidityDays' => 90]))
        ->assertOk();

    $this->actingAs($other)
        ->getJson('/api/invoicing/settings')
        ->assertJsonPath('quoteValidityDays', 30);
    expect($other->settingsOrFail()->fresh()->quote_validity_days)->toBe(30);
});

test('keeps the option for VAT on debits off under the franchise', function (): void {
    $user = User::factory()->create();
    $user->settingsOrFail()->update(['vat_regime' => VatRegime::FranchiseEnBase]);

    $this->actingAs($user)
        ->putJson('/api/invoicing/settings', invoicingSettingsPayload(['vatOnDebits' => true]))
        ->assertOk()
        ->assertJsonPath('vatOnDebits', false)
        ->assertJsonPath('vatLiable', false);
});

test('records the option for VAT on debits of a VAT-liable account', function (): void {
    $user = User::factory()->create();
    $user->settingsOrFail()->update(['vat_regime' => VatRegime::ReelSimplifie]);

    $this->actingAs($user)
        ->putJson('/api/invoicing/settings', invoicingSettingsPayload(['vatOnDebits' => true]))
        ->assertOk()
        ->assertJsonPath('vatOnDebits', true);
});

test('hides a stored VAT-on-debits choice once the account leaves VAT liability', function (): void {
    $user = User::factory()->create();
    $user->settingsOrFail()->update(['vat_regime' => VatRegime::ReelSimplifie]);
    $this->actingAs($user)->putJson('/api/invoicing/settings', invoicingSettingsPayload(['vatOnDebits' => true]))->assertOk();

    $user->settingsOrFail()->update(['vat_regime' => VatRegime::FranchiseEnBase]);

    $this->actingAs($user)
        ->getJson('/api/invoicing/settings')
        ->assertOk()
        ->assertJsonPath('vatOnDebits', false)
        ->assertJsonPath('vatLiable', false);
});

test('refuses an unknown mode or category and overlong mentions', function (array $overrides, string $field): void {
    $this->actingAs(User::factory()->create())
        ->putJson('/api/invoicing/settings', invoicingSettingsPayload($overrides))
        ->assertJsonValidationErrorFor($field);
})->with([
    'mode' => [['mode' => 9], 'mode'],
    'category' => [['operationCategory' => 9], 'operationCategory'],
    'mentions' => [['customMentions' => str_repeat('x', 2001)], 'customMentions'],
    'validity' => [['quoteValidityDays' => 0], 'quoteValidityDays'],
]);

test('needs a signed-in account', function (): void {
    $this->getJson('/api/invoicing/settings')->assertUnauthorized();
    $this->putJson('/api/invoicing/settings', invoicingSettingsPayload())->assertUnauthorized();
});

test('saves the quotes\' number format and keeps it when omitted', function (): void {
    $user = vatLiableUser();
    $payload = collect($this->actingAs($user)->getJson('/api/invoicing/settings')->json())->except('quoteNumberFormat')->all();

    $this->actingAs($user)
        ->putJson('/api/invoicing/settings', [...$payload, 'quoteNumberFormat' => 'DEV-AAAA-NNN'])
        ->assertOk()
        ->assertJsonPath('quoteNumberFormat', 'DEV-AAAA-NNN')
        ->assertJsonPath('nextQuoteNumber', 'DEV-2026-001');
    $this->actingAs($user)
        ->putJson('/api/invoicing/settings', $payload)
        ->assertOk()
        ->assertJsonPath('quoteNumberFormat', 'DEV-AAAA-NNN');
    $this->actingAs($user)
        ->putJson('/api/invoicing/settings', [...$payload, 'quoteNumberFormat' => 'DEV-AAAA'])
        ->assertUnprocessable()
        ->assertJsonValidationErrorFor('quoteNumberFormat');
});
