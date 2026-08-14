<?php

declare(strict_types=1);

use App\Domain\Shared\Enums\Currency;
use Money\Currencies\ISOCurrencies;
use Money\Currency as MoneyCurrency;

test('every supported currency divides into hundredths', function (Currency $currency): void {
    $isoCurrencies = new ISOCurrencies;

    expect($isoCurrencies->subunitFor(new MoneyCurrency($currency->value)))->toBe(2);
})->with(Currency::cases());

test('every supported currency is a real ISO 4217 code', function (Currency $currency): void {
    expect((new ISOCurrencies)->contains(new MoneyCurrency($currency->value)))->toBeTrue();
})->with(Currency::cases());

test('prints the symbol French Intl uses, never a bare ambiguous glyph', function (Currency $currency, string $expected): void {
    expect($currency->symbol())->toBe($expected);
})->with([
    'the euro' => [Currency::EUR, '€'],
    'the US dollar is qualified' => [Currency::USD, '$US'],
    'the Canadian dollar is qualified' => [Currency::CAD, '$CA'],
    'the pound is qualified' => [Currency::GBP, '£GB'],
    'a currency with no French symbol falls back to its code' => [Currency::PLN, 'PLN'],
]);
