<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Data\BankBalanceData;
use App\Domain\Bank\Data\PersonalTransferData;
use App\Domain\Bank\Data\TreasuryData;
use App\Domain\Bank\Models\PersonalTransfer;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Data\SignedMoneyData;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;

/**
 * « Combien je peux me virer ? » — the pro-account balance, less what the fisc
 * is owed and the matelas, less the transfers the balance does not show yet.
 *
 * The last term is what keeps the figure honest between making a transfer and
 * importing the statement that carries it: ResolveBalanceCoverage says how far
 * the balance is complete, and only transfers dated past that are deducted on
 * top of it. Once the statement lands, the movement lowers the balance and the
 * same transfer stops being counted — the figure does not move.
 *
 * It reads the whole movement history because ResolveBankBalance and
 * ComputeBankProvisions both take collections. If that ever shows up in a
 * profile, the fix is to let those two query for themselves (the balance anchor
 * and the fisc debits are both index-backed lookups) rather than to filter here
 * against their internals.
 */
class SummarizeTreasury
{
    public function __construct(
        private readonly ResolveBankBalance $resolveBankBalance,
        private readonly ComputeBankProvisions $computeBankProvisions,
        private readonly ResolveCurrentBalance $resolveCurrentBalance,
        private readonly ResolveBalanceCoverage $resolveBalanceCoverage,
    ) {}

    public function handle(User $user): TreasuryData
    {
        $settings = $user->settingsOrFail();
        $currency = $settings->currency->value;

        $movements = $user->bankMovements()
            ->orderByDesc('booked_on')
            ->orderByDesc('id')
            ->get();

        $statements = $user->bankStatements()->get();

        $anchor = $this->resolveBankBalance->handle($user, $statements, $movements);
        $balance = $this->resolveCurrentBalance->handle($anchor, $movements, $currency)['balance'];

        $coveredThrough = $this->resolveBalanceCoverage->handle(
            $anchor,
            $movements->first()?->booked_on,
            $settings->today(),
        );

        $transfers = $user->personalTransfers()
            ->orderByDesc('transferred_on')
            ->orderByDesc('id')
            ->get();

        $pendingCents = (int) $transfers
            ->filter(fn (PersonalTransfer $transfer): bool => $this->isPending($transfer, $coveredThrough))
            ->sum(static fn (PersonalTransfer $transfer): int => (int) $transfer->amount_cents->getAmount());

        $provisions = $this->computeBankProvisions->handle($user, $movements);

        // What is left once the transfers the balance cannot know about are
        // taken off it — the figure the provisions then come out of.
        $effectiveBalance = $balance instanceof BankBalanceData
            ? $balance->amount->toMoney()->subtract(new Money($pendingCents, $currency))
            : null;

        return new TreasuryData(
            balance: $balance,
            pendingTransfers: MoneyData::fromMoney(new Money($pendingCents, $currency)),
            coveredThrough: $coveredThrough,
            provisions: $provisions,
            transferable: $effectiveBalance === null
                ? null
                : SignedMoneyData::fromMoney($effectiveBalance->subtract($provisions->total->toMoney())),
            transfers: array_values($transfers
                ->map(fn (PersonalTransfer $transfer): PersonalTransferData => PersonalTransferData::fromModel(
                    $transfer,
                    reflectedInBalance: ! $this->isPending($transfer, $coveredThrough),
                ))
                ->all()),
        );
    }

    /**
     * Still waiting on a relevé: dated past what the balance covers, or on an
     * account whose balance nothing covers at all. One spelling, because the
     * deducted total and the per-row badge must never disagree on screen.
     */
    private function isPending(PersonalTransfer $transfer, ?CarbonImmutable $coveredThrough): bool
    {
        return ! $coveredThrough instanceof CarbonImmutable || $transfer->transferred_on->greaterThan($coveredThrough);
    }
}
