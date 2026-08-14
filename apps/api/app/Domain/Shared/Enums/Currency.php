<?php

declare(strict_types=1);

namespace App\Domain\Shared\Enums;

/**
 * The currencies an account can be denominated in.
 *
 * Backed by the ISO 4217 code rather than an int — unlike every other enum here —
 * because the code *is* the identifier the rest of the stack speaks: moneyphp,
 * `Intl.NumberFormat`, and the `char(3)` columns all round-trip it verbatim.
 *
 * Every case must have an ISO minor unit of 2, because storage is `*_cents`
 * columns and the whole codebase reads them as hundredths. CurrencyTest enforces
 * it, so adding JPY (0 decimals) or TND (3) fails the suite rather than quietly
 * mis-stating amounts by two orders of magnitude.
 */
enum Currency: string
{
    case EUR = 'EUR';
    case USD = 'USD';
    case GBP = 'GBP';
    case CHF = 'CHF';
    case CAD = 'CAD';
    case AUD = 'AUD';
    case NZD = 'NZD';
    case SEK = 'SEK';
    case NOK = 'NOK';
    case DKK = 'DKK';
    case PLN = 'PLN';
    case CZK = 'CZK';
    case RON = 'RON';
    case BGN = 'BGN';
    case SGD = 'SGD';
    case HKD = 'HKD';
    case AED = 'AED';
    case ILS = 'ILS';
    case INR = 'INR';
    case BRL = 'BRL';
    case MXN = 'MXN';
    case ZAR = 'ZAR';
    case MAD = 'MAD';

    /**
     * The glyph to print on a generated document.
     *
     * The CRA is a French artifact, so this is the symbol French `Intl` uses —
     * generated from `Intl.NumberFormat("fr-FR").formatToParts` and matching
     * what the web shows a French reader ("$US", never a bare "$" that six other
     * dollar-denominated currencies could claim). Hard-coded rather than
     * `NumberFormatter`: composer.json does not require ext-intl, and a symbol
     * table is not worth making a self-hosted install depend on an extension.
     */
    public function symbol(): string
    {
        return match ($this) {
            self::EUR => '€',
            self::USD => '$US',
            self::GBP => '£GB',
            self::CAD => '$CA',
            self::AUD => '$AU',
            self::NZD => '$NZ',
            self::SGD => '$SG',
            self::MXN => '$MX',
            self::ILS => '₪',
            self::INR => '₹',
            self::BRL => 'R$',
            default => $this->value,
        };
    }
}
