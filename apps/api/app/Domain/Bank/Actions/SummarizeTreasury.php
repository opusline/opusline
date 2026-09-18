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
 *
 * @phpstan-import-type BalanceAnchor from ResolveBankBalance
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
            ->filter(fn (PersonalTransfer $transfer): bool => $this->isPending($transfer->transferred_on, $coveredThrough, $anchor))
            ->sum(static fn (PersonalTransfer $transfer): int => (int) $transfer->amount_cents->getAmount());

        $provisions = $this->computeBankProvisions->handle($user);
        $pendingDeclarationsCents = $this->pendingDeclarationsCents($provisions, $coveredThrough, $anchor);

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
                    reflectedInBalance: ! $this->isPending($transfer->transferred_on, $coveredThrough, $anchor),
                ))
                ->all()),
        );
    }

    /**
     * @param  ?BalanceAnchor  $anchor
     */
    private function pendingDeclarationsCents(BankProvisionsData $provisions, ?CarbonImmutable $coveredThrough, ?array $anchor): int
    {
        $cents = 0;

        foreach ([$provisions->vat, $provisions->urssaf, $provisions->cfe] as $provision) {
            foreach ($provision->paidPeriods ?? [] as $paidPeriod) {
                if ($this->isPending($paidPeriod->paidOn, $coveredThrough, $anchor)) {
                    $cents += $paidPeriod->amount->amount;
                }
            }
        }

        return $cents;
    }

    /**
     * Still waiting on a relevé: dated past what the balance covers, on an
     * account whose balance nothing covers at all, or on the day a typed
     * balance was read. One spelling, because the deducted totals and the
     * per-row badge must never disagree on screen.
     *
     * A typed balance vouches only for the day before it was read, while the
     * roll-forward adds only what was booked after its date. A transfer made
     * that day falls in neither, so no imported movement can ever make the
     * balance show it: it stays deducted until a newer balance is typed.
     *
     * @param  ?BalanceAnchor  $anchor
     */
    private function isPending(CarbonImmutable $datedOn, ?CarbonImmutable $coveredThrough, ?array $anchor): bool
    {
        if (! $coveredThrough instanceof CarbonImmutable || $anchor === null) {
            return true;
        }

        $isOnAnchorBlindDay = $datedOn->greaterThan($anchor['coversThrough'])
            && ! $datedOn->greaterThan($anchor['asOf']);

        return $isOnAnchorBlindDay || $datedOn->greaterThan($coveredThrough);
    }
}
