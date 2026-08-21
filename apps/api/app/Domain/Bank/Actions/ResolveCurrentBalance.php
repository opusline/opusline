<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Data\BankBalanceData;
use App\Domain\Bank\Models\BankMovement;
use App\Domain\Shared\Data\SignedMoneyData;
use Cknow\Money\Money;
use Illuminate\Support\Collection;

/**
 * The balance every screen shows: the anchor rolled forward through the
 * movements booked after it, plus the running balance behind each movement row.
 *
 * Both aggregators go through here so the Compte pro tile and the Virement
 * hero can never quote different figures for the same account.
 *
 * @phpstan-import-type BalanceAnchor from ResolveBankBalance
 */
class ResolveCurrentBalance
{
    public function __construct(private readonly ComputeRunningBalances $computeRunningBalances) {}

    /**
     * @param  ?BalanceAnchor  $anchor
     * @param  Collection<int, BankMovement>  $movements  newest first
     * @return array{balance: ?BankBalanceData, runningBalances: list<?int>} running balances aligned with $movements
     */
    public function handle(?array $anchor, Collection $movements, string $currency): array
    {
        $chronological = $movements->reverse();

        $balances = array_reverse($this->computeRunningBalances->handle(
            $anchor['cents'] ?? null,
            $anchor['asOf'] ?? null,
            array_values($chronological
                ->map(static fn (BankMovement $movement): array => [
                    $movement->booked_on,
                    (int) $movement->amount_cents->getAmount(),
                ])
                ->all()),
        ));

        return [
            'balance' => $anchor === null ? null : $this->balance($anchor, $balances, $currency),
            'runningBalances' => $balances,
        ];
    }

    /**
     * @param  BalanceAnchor  $anchor
     * @param  list<?int>  $runningBalances  newest first
     */
    private function balance(array $anchor, array $runningBalances, string $currency): BankBalanceData
    {
        // The anchor rolled forward through later movements — exactly the
        // newest row's running balance when there are movements.
        $current = $runningBalances[0] ?? $anchor['cents'];

        return new BankBalanceData(
            amount: SignedMoneyData::fromMoney(new Money($current, $currency)),
            source: $anchor['source'],
            asOf: $anchor['citableAsOf'],
        );
    }
}
