<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use Carbon\CarbonImmutable;

/**
 * The date through which the shown balance provably accounts for the account's
 * debits — which is what tells a recorded personal transfer apart from one the
 * bank has already shown us.
 *
 * The anchor states what it covers (see ResolveBankBalance); on top of that,
 * every imported movement is evidence of coverage through its own date, so the
 * later of the two wins.
 *
 * @phpstan-import-type BalanceAnchor from ResolveBankBalance
 */
class ResolveBalanceCoverage
{
    /**
     * @param  ?BalanceAnchor  $anchor
     */
    public function handle(?array $anchor, ?CarbonImmutable $lastMovementOn, CarbonImmutable $today): ?CarbonImmutable
    {
        if ($anchor === null) {
            return null;
        }

        $anchoredThrough = $anchor['coversThrough'];

        if (! $lastMovementOn instanceof CarbonImmutable) {
            return $anchoredThrough;
        }

        // A single value-dated line booked next month would otherwise claim
        // coverage over weeks nobody has seen, silently suppressing every
        // pending transfer until then. The anchor stays unclamped: a statement
        // closing in the future is a file the balance already trusts.
        if ($lastMovementOn->greaterThan($today)) {
            $lastMovementOn = $today;
        }

        return $lastMovementOn->greaterThan($anchoredThrough) ? $lastMovementOn : $anchoredThrough;
    }
}
