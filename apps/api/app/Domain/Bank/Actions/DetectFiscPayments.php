<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Models\BankMovement;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

/**
 * Recognizes the fisc's debits in bank labels: URSSAF prélèvements, TVA
 * télérèglements and the CFE. Matching is word-bounded on a normalized
 * label — "TVA" the word, never the letters inside "NUIT VALENCE" — and
 * deliberately narrow: a bare DGFiP debit is NOT treated as TVA, because the
 * DGFiP also collects income tax through the same channel.
 */
final class DetectFiscPayments
{
    public static function isUrssaf(string $label): bool
    {
        return preg_match('/\bURSSAF\b/', self::normalized($label)) === 1;
    }

    public static function isVat(string $label): bool
    {
        return preg_match('/\bTVA\b/', self::normalized($label)) === 1;
    }

    public static function isCfe(string $label): bool
    {
        return preg_match('/\bCFE\b/', self::normalized($label)) === 1;
    }

    /**
     * The fisc's debits of one kind over the window, as positive cents.
     *
     * @param  Collection<int, BankMovement>  $movements  covering at least [$start, $end]
     * @param  callable(string): bool  $matchesLabel  one of the predicates above
     */
    public static function debitedBetween(Collection $movements, CarbonImmutable $start, CarbonImmutable $end, callable $matchesLabel): int
    {
        $startDate = $start->toDateString();
        $endDate = $end->toDateString();
        $total = 0;

        foreach ($movements as $movement) {
            $cents = (int) $movement->amount_cents->getAmount();

            if ($cents >= 0) {
                continue;
            }

            $bookedOn = $movement->booked_on->toDateString();

            if ($bookedOn >= $startDate && $bookedOn <= $endDate && $matchesLabel($movement->label)) {
                $total += -$cents;
            }
        }

        return $total;
    }

    private static function normalized(string $label): string
    {
        return trim(preg_replace('/[^A-Z0-9]+/', ' ', NormalizeBankText::foldAccents($label)) ?? '');
    }
}
