<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Enums;

/** The language a document is rendered in, chosen per document; independent of the interface locale. */
enum DocumentLanguage: int
{
    case French = 0;
    case English = 1;

    /** The locale for __() and the Blade view. */
    public function locale(): string
    {
        return match ($this) {
            self::French => 'fr',
            self::English => 'en',
        };
    }

    /** The locale for intl number and date formatters. */
    public function intlLocale(): string
    {
        return match ($this) {
            self::French => 'fr_FR',
            self::English => 'en_GB',
        };
    }
}
