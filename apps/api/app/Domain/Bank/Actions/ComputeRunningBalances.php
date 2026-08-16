<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use Carbon\CarbonImmutable;

/**
 * Derives the balance after each movement from one anchor, instead of trusting
 * per-line balances out of statement files — overlapping exports from
 * different formats can never be made to agree, one derivation always does.
 *
 * The anchor is a day's closing balance, so it covers every movement booked on
 * or before its date: those walk backwards from the anchor, later ones walk
 * forwards.
 */
class ComputeRunningBalances
{
    /**
     * @param  list<array{CarbonImmutable, int}>  $movements  chronological (bookedOn, signed cents)
     * @return list<?int> balance after each movement, chronological; all null without an anchor
     */
    public function handle(?int $anchorCents, ?CarbonImmutable $anchorOn, array $movements): array
    {
        if ($anchorCents === null || ! $anchorOn instanceof CarbonImmutable) {
            return array_fill(0, count($movements), null);
        }

        $lastCovered = -1;

        foreach ($movements as $index => [$bookedOn]) {
            if ($bookedOn->lessThanOrEqualTo($anchorOn)) {
                $lastCovered = $index;
            }
        }

        $balances = array_fill(0, count($movements), null);
        $balance = $anchorCents;

        for ($index = $lastCovered; $index >= 0; $index--) {
            $balances[$index] = $balance;
            $balance -= $movements[$index][1];
        }

        $balance = $anchorCents;
        $counter = count($movements);

        for ($index = $lastCovered + 1; $index < $counter; $index++) {
            $balance += $movements[$index][1];
            $balances[$index] = $balance;
        }

        return array_values($balances);
    }
}
