<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Data\BankBalanceData;
use App\Domain\Shared\Data\SignedMoneyData;
use App\Domain\Users\Models\User;
use Cknow\Money\Money;

/**
 * The balance every screen shows: the anchor rolled forward through the
 * movements booked after it — one indexed SUM, never the hydrated history.
 *
 * Both aggregators go through here so the Compte pro tile and the Virement
 * hero can never quote different figures for the same account. The per-row
 * running balances of the movement table walk backwards from this same figure
 * in ListBankMovements.
 *
 * @phpstan-import-type BalanceAnchor from ResolveBankBalance
 */
class ResolveCurrentBalance
{
    /**
     * @param  ?BalanceAnchor  $anchor
     */
    public function handle(User $user, ?array $anchor, string $currency): ?BankBalanceData
    {
        if ($anchor === null) {
            return null;
        }

        // The anchor is a day's close, so it already accounts for everything
        // booked on or before its own date; only strictly later movements move
        // the figure.
        $bookedAfterAnchor = (int) $user->bankMovements()
            ->where('booked_on', '>', $anchor['asOf']->toDateString())
            ->sum('amount_cents');

        return new BankBalanceData(
            amount: SignedMoneyData::fromMoney(new Money($anchor['cents'] + $bookedAfterAnchor, $currency)),
            source: $anchor['source'],
            asOf: $anchor['citableAsOf'],
        );
    }
}
