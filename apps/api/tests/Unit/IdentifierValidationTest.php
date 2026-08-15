<?php

declare(strict_types=1);

use App\Domain\Shared\Validation\Siret;
use App\Domain\Shared\Validation\VatNumber;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\App;
use Tests\TestCase;

// The rules read their messages from the lang catalog, so these tests need a
// booted application — unlike the rest of tests/Unit, which stays container-free.
uses(TestCase::class);

function rejects(ValidationRule $rule, mixed $value): bool
{
    $rejected = false;

    $rule->validate('identifier', $value, function () use (&$rejected): void {
        $rejected = true;
    });

    return $rejected;
}

function failureMessage(ValidationRule $rule, mixed $value): ?string
{
    $message = null;

    $rule->validate('identifier', $value, function (string $failure) use (&$message): void {
        $message = $failure;
    });

    return $message;
}

test('accepts a SIRET with a valid Luhn checksum', function (string $siret): void {
    expect(rejects(new Siret, $siret))->toBeFalse();
})->with([
    'Google France' => ['44306184100047'],
    'spaced input' => ['443 061 841 00047'],
]);

test('accepts a La Poste SIRET, which is exempt from Luhn', function (): void {
    // Digits sum to 15, a multiple of 5; a plain Luhn check would reject it.
    expect(rejects(new Siret, '35600000000001'))->toBeFalse();
});

test('rejects a malformed or mistyped SIRET', function (mixed $siret): void {
    expect(rejects(new Siret, $siret))->toBeTrue();
})->with([
    'one digit off' => ['44306184100048'],
    'too short' => ['4430618410004'],
    'too long' => ['443061841000477'],
    'letters' => ['4430618410004A'],
    'empty' => [''],
    'not a string' => [12345678901234],
]);

test('accepts a French VAT number whose key matches the SIREN', function (string $vat): void {
    expect(rejects(new VatNumber, $vat))->toBeFalse();
})->with([
    'plain' => ['FR64443061841'],
    'spaced and lowercase' => ['fr 64 443 061 841'],
]);

test('rejects a French VAT number with a wrong key', function (): void {
    // The SIREN's real key is 64.
    expect(rejects(new VatNumber, 'FR54443061841'))->toBeTrue();
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
    'no country code' => ['443061841'],
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
