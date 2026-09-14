<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Data\BankBalanceData;
use App\Domain\Bank\Data\BankProvisionsData;
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
 * is owed and the matelas, less the transfers and the tax payments the
 * balance does not show yet.
 *
 * The last term is what keeps the figure honest between making a transfer —
 * or paying a return — and importing the statement that carries it:
 * ResolveBalanceCoverage says how far the balance is complete, and only what
 * is dated past that is deducted on top of it. Once the statement lands, the
 * movement lowers the balance and the same amount stops being counted — the
 * figure does not move. A return is dated by the day it was marked paid, and
 * counted at what the provisions carried for it, so marking it paid does not
 * move the figure either.
 *
 * Every movement-derived figure here is an index-backed aggregate; the
 * movement history itself is never hydrated, whatever the account's age.
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

        $statements = $user->bankStatements()->get();

        $anchor = $this->resolveBankBalance->handle($user, $statements);
        $balance = $this->resolveCurrentBalance->handle($user, $anchor, $currency);

        // value() hydrates through the CalendarDate cast, unlike max().
        $lastBookedOn = $user->bankMovements()->orderByDesc('booked_on')->value('booked_on');

        $coveredThrough = $this->resolveBalanceCoverage->handle(
            $anchor,
            $lastBookedOn instanceof CarbonImmutable ? $lastBookedOn : null,
            $settings->today(),
        );

        $transfers = $user->personalTransfers()
            ->orderByDesc('transferred_on')
            ->orderByDesc('id')
            ->get();

        $pendingCents = (int) $transfers
            ->filter(fn (PersonalTransfer $transfer): bool => $this->isPending($transfer->transferred_on, $coveredThrough))
            ->sum(static fn (PersonalTransfer $transfer): int => (int) $transfer->amount_cents->getAmount());

        $provisions = $this->computeBankProvisions->handle($user);
        $pendingDeclarationsCents = $this->pendingDeclarationsCents($provisions, $coveredThrough);

        // What is left once the transfers and payments the balance cannot know
        // about are taken off it — the figure the provisions then come out of.
        $effectiveBalance = $balance instanceof BankBalanceData
            ? $balance->amount->toMoney()->subtract(new Money($pendingCents + $pendingDeclarationsCents, $currency))
            : null;

        return new TreasuryData(
            balance: $balance,
            pendingTransfers: MoneyData::fromMoney(new Money($pendingCents, $currency)),
            pendingDeclarations: MoneyData::fromMoney(new Money($pendingDeclarationsCents, $currency)),
            coveredThrough: $coveredThrough,
            provisions: $provisions,
            transferable: $effectiveBalance === null
                ? null
                : SignedMoneyData::fromMoney($effectiveBalance->subtract($provisions->total->toMoney())),
            transfers: array_values($transfers
                ->map(fn (PersonalTransfer $transfer): PersonalTransferData => PersonalTransferData::fromModel(
                    $transfer,
                    reflectedInBalance: ! $this->isPending($transfer->transferred_on, $coveredThrough),
                ))
                ->all()),
        );
    }

    private function pendingDeclarationsCents(BankProvisionsData $provisions, ?CarbonImmutable $coveredThrough): int
    {
        $cents = 0;

        foreach ([$provisions->vat, $provisions->urssaf, $provisions->cfe] as $provision) {
            foreach ($provision->paidPeriods ?? [] as $paidPeriod) {
                if ($this->isPending($paidPeriod->paidOn, $coveredThrough)) {
                    $cents += $paidPeriod->amount->amount;
                }
            }
        }

        return $cents;
    }

    /**
     * Still waiting on a relevé: dated past what the balance covers, or on an
     * account whose balance nothing covers at all. One spelling, because the
     * deducted totals and the per-row badge must never disagree on screen.
     */
    private function isPending(CarbonImmutable $datedOn, ?CarbonImmutable $coveredThrough): bool
    {
        return ! $coveredThrough instanceof CarbonImmutable || $datedOn->greaterThan($coveredThrough);
    }
}
