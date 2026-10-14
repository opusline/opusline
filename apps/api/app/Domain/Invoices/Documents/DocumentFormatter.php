<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Documents;

use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Settings\Enums\DateFormat;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use NumberFormatter;

/**
 * Amounts, rates, quantities and dates as a document prints them: in its own
 * language, with the account's numeric date layout.
 */
final readonly class DocumentFormatter
{
    public function __construct(
        public DocumentLanguage $language,
        private DateFormat $dateFormat,
    ) {}

    /** The locale for __() and for the number formatters. */
    public function locale(): string
    {
        return $this->language === DocumentLanguage::English ? 'en' : 'fr';
    }

    public function money(Money $amount): string
    {
        $formatter = new NumberFormatter($this->intlLocale(), NumberFormatter::CURRENCY);
        $formatted = (string) $formatter->formatCurrency((int) $amount->getAmount() / 100, $amount->getCurrency()->getCode());

        // The narrow no-break space intl puts in French amounts is missing from
        // the embedded fonts; the plain no-break space reads the same.
        return str_replace("\u{202F}", "\u{00A0}", $formatted);
    }

    /** 2000 → « 20 % », 550 → « 5,5 % ». */
    public function rate(int $basisPoints): string
    {
        return $this->decimal($basisPoints / 100).' %';
    }

    /** 1500 thousandths of a day → « 1,5 j ». */
    public function quantity(int $quantityMilli, LineUnit $unit): string
    {
        $unitKey = match ($unit) {
            LineUnit::Day => 'day',
            LineUnit::Hour => 'hour',
            LineUnit::Flat => 'flat',
            LineUnit::Unit => 'unit',
        };

        return $this->decimal($quantityMilli / 1000).' '.__("invoice_document.units.{$unitKey}", locale: $this->locale());
    }

    public function date(CarbonImmutable $date): string
    {
        return $date->format($this->dateFormat === DateFormat::YearMonthDay ? 'Y-m-d' : 'd/m/Y');
    }

    private function decimal(float $value): string
    {
        $formatter = new NumberFormatter($this->intlLocale(), NumberFormatter::DECIMAL);
        $formatter->setAttribute(NumberFormatter::MAX_FRACTION_DIGITS, 3);

        return (string) $formatter->format($value);
    }

    private function intlLocale(): string
    {
        return $this->language === DocumentLanguage::English ? 'en_GB' : 'fr_FR';
    }
}
