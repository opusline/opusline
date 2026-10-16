<?php

declare(strict_types=1);

use App\Domain\Shared\Validation\Bic;
use App\Domain\Shared\Validation\Iban;
use App\Domain\Shared\Validation\Siret;
use App\Domain\Shared\Validation\VatNumber;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\App;
use Tests\TestCase;

// The rules read their messages from the lang catalog, so these tests need a
// booted application — unlike the rest of tests/Unit, which stays container-free.
uses(TestCase::class);

// The identifiers below are synthetic: Luhn-valid and key-valid, belonging to
// no registered company. Fixtures name no real business, identifiers included.
test('accepts a SIRET with a valid Luhn checksum', function (string $siret): void {
    expect(rejects(new Siret, $siret))->toBeFalse();
})->with([
    'plain digits' => ['12345678200002'],
    'spaced input' => ['123 456 782 00002'],
]);

test('accepts a La Poste SIRET, which is exempt from Luhn', function (): void {
    // Digits sum to 15, a multiple of 5; a plain Luhn check would reject it.
    expect(rejects(new Siret, '35600000000001'))->toBeFalse();
});

test('rejects a malformed or mistyped SIRET', function (mixed $siret): void {
    expect(rejects(new Siret, $siret))->toBeTrue();
})->with([
    'one digit off' => ['12345678200003'],
    'too short' => ['1234567820000'],
    'too long' => ['123456782000022'],
    'letters' => ['1234567820000A'],
    'empty' => [''],
    'not a string' => [12345678901234],
]);

test('accepts a French VAT number whose key matches the SIREN', function (string $vat): void {
    expect(rejects(new VatNumber, $vat))->toBeFalse();
})->with([
    'plain' => ['FR11123456782'],
    'spaced and lowercase' => ['fr 11 123 456 782'],
]);

test('rejects a French VAT number with a wrong key', function (): void {
    // The SIREN's real key is 11.
    expect(rejects(new VatNumber, 'FR54123456782'))->toBeTrue();
});

test('accepts other member states on shape alone', function (string $vat): void {
    expect(rejects(new VatNumber, $vat))->toBeFalse();
})->with([
    'Germany' => ['DE123456789'],
    'Belgium' => ['BE0123456789'],
    'Netherlands' => ['NL123456789B01'],
]);

test('rejects an unknown country code or a broken shape', function (mixed $vat): void {
    expect(rejects(new VatNumber, $vat))->toBeTrue();
})->with([
    'not an EU code' => ['US123456789'],
    'German number too short' => ['DE12345678'],
    'no country code' => ['123456782'],
    'empty' => [''],
]);

test('explains the rejection in the request language', function (string $locale, ValidationRule $rule, string $key): void {
    App::setLocale($locale);

    // The not-a-key guard catches a missing catalog entry, where __() would
    // return the key on both sides and the equality would pass vacuously.
    expect(failureMessage($rule, ''))->toBe(__($key))->not->toBe($key);
})->with(['fr', 'en'])->with([
    'SIRET' => [new Siret, 'rules.siret'],
    'VAT number' => [new VatNumber, 'rules.vat_number'],
]);

// The textbook examples of ISO 13616 and the banks' own documentation, not accounts.
test('accepts a valid IBAN, spaced or not, from several countries', function (string $iban): void {
    expect(rejects(new Iban, $iban))->toBeFalse();
})->with([
    'France' => ['FR7630006000011234567890189'],
    'France, printed in groups' => ['FR76 3000 6000 0112 3456 7890 189'],
    'lowercase' => ['fr7630006000011234567890189'],
    'Germany' => ['DE89370400440532013000'],
    'United Kingdom' => ['GB82WEST12345698765432'],
    'Belgium' => ['BE68539007547034'],
]);

test('rejects a malformed or mistyped IBAN', function (mixed $iban): void {
    expect(rejects(new Iban, $iban))->toBeTrue();
})->with([
    'one digit off' => ['DE89370400440532013001'],
    'swapped check digits' => ['FR6730006000011234567890189'],
    'too short' => ['FR763000'],
    'valid checksum but not the French length' => ['FR9112345678901'],
    'valid checksum under a country the registry does not list' => ['ZZ8112345678901'],
    'no country' => ['7630006000011234567890189'],
    'empty' => [''],
    'not a string' => [7630006000011234567],
]);

test('accepts a BIC of 8 or 11 characters', function (string $bic): void {
    expect(rejects(new Bic, $bic))->toBeFalse();
})->with([
    'head office' => ['AGRIFRPP'],
    'branch' => ['AGRIFRPP882'],
    'lowercase, padded' => [' agrifrpp '],
]);

test('rejects a BIC of the wrong shape', function (mixed $bic): void {
    expect(rejects(new Bic, $bic))->toBeTrue();
})->with([
    'too short' => ['AGRIFR'],
    'nine characters' => ['AGRIFRPP1'],
    'digits in the bank code' => ['12RIFRPP'],
    'not a string' => [12345678],
]);
