<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\NextInvoiceNumberData;
use App\Domain\Shared\Validation\InvoiceNumberFormat;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use RuntimeException;

/**
 * Renders the user's invoice_number_format for today and proposes the next counter.
 *
 * There is no counter table on purpose. The counter is read back off the numbers that
 * exist, so typing a reference straight from Shine never leaves a stored sequence out
 * of step with reality. Uniqueness is enforced by the unique index, not by this.
 */
class SuggestInvoiceNumber
{
    private const int COUNTER_WIDTH = 3;

    public function handle(User $user): NextInvoiceNumberData
    {
        $settings = $user->settingsOrFail();
        $format = $settings->invoice_number_format;
        $today = $settings->today();

        [$prefix, $suffix] = $this->renderAroundCounter($format, $today);

        $counter = $this->nextCounter($user, $prefix, $suffix);

        return new NextInvoiceNumberData(
            number: $prefix.str_pad((string) $counter, self::COUNTER_WIDTH, '0', STR_PAD_LEFT).$suffix,
            format: $format,
        );
    }

    /**
     * Split the format at its counter, rendering the date tokens on either side.
     *
     * One tokenising pass decides what is a token and what is literal text, so a
     * literal that merely contains "MM" or "NNN" is never mistaken for one — string
     * searching the rendered result would split on the wrong occurrence.
     *
     * @return array{string, string}
     */
    private function renderAroundCounter(string $format, CarbonImmutable $today): array
    {
        $pieces = preg_split(
            InvoiceNumberFormat::TOKEN_RUN_PATTERN,
            $format,
            flags: PREG_SPLIT_DELIM_CAPTURE,
        );

        if ($pieces === false) {
            throw new RuntimeException("Invoice number format [{$format}] could not be parsed.");
        }

        $sides = ['', ''];
        $seenCounter = false;

        // Odd offsets are token runs, even ones the literal text between them.
        foreach ($pieces as $offset => $piece) {
            if ($offset % 2 === 0) {
                $sides[$seenCounter ? 1 : 0] .= $piece;

                continue;
            }

            preg_match_all(InvoiceNumberFormat::TOKEN_PATTERN, $piece, $tokens);

            foreach ($tokens[0] as $token) {
                if ($token === InvoiceNumberFormat::COUNTER_TOKEN && ! $seenCounter) {
                    $seenCounter = true;

                    continue;
                }

                $sides[$seenCounter ? 1 : 0] .= match ($token) {
                    InvoiceNumberFormat::YEAR_TOKEN => $today->format('Y'),
                    InvoiceNumberFormat::MONTH_TOKEN => $today->format('m'),
                    default => $token,
                };
            }
        }

        // The validation rule guarantees a counter, so a format without one means the
        // column was written around it — fail loudly rather than emit a broken number.
        if (! $seenCounter) {
            throw new RuntimeException("Invoice number format [{$format}] has no counter token.");
        }

        return $sides;
    }

    /**
     * The rendered prefix already carries the year and month, so matching on it in SQL
     * both scopes the counter to the right period and keeps the scan off every number
     * the account has ever had.
     */
    private function nextCounter(User $user, string $prefix, string $suffix): int
    {
        $pattern = '/^'.preg_quote($prefix, '/').'(\d+)'.preg_quote($suffix, '/').'$/';

        // The prefix goes into LIKE unescaped on purpose. The format's literals are
        // limited to [A-Za-z0-9-/_. ], so the only wildcard it can contain is "_",
        // which over-matches — and over-matching is free here because the regex below
        // is the real filter. Escaping it instead would need an ESCAPE clause, which
        // sqlite and MySQL disagree about by default.
        /** @var list<string> $numbers */
        $numbers = $user->invoices()
            ->whereNotNull('number')
            ->where('number', 'like', $prefix.'%')
            ->pluck('number')
            ->all();

        $counter = 0;

        foreach ($numbers as $number) {
            if (preg_match($pattern, $number, $matches) === 1) {
                $counter = max($counter, (int) $matches[1]);
            }
        }

        return $counter + 1;
    }
}
