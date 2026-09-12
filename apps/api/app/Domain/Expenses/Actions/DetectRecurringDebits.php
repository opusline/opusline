<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Bank\Actions\DetectFiscPayments;
use App\Domain\Bank\Actions\NormalizeBankText;
use App\Domain\Bank\Models\BankMovement;
use App\Domain\Expenses\Data\RecurringDebitData;
use App\Domain\Expenses\Models\RecurringDebitDismissal;
use App\Domain\Expenses\Models\Subscription;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

/**
 * The debits that come back month after month with nothing in the journal
 * behind them — the same label and the same cents, three months running
 * and still current. The fisc's own debits, the ones the user dismissed,
 * and the ones a subscription already explains are left out.
 */
class DetectRecurringDebits
{
    private const int MIN_CONSECUTIVE_MONTHS = 3;

    /**
     * @param  Collection<int, Subscription>  $subscriptions  the ones still debiting — their suppliers explain their debits
     * @return list<RecurringDebitData>
     */
    public function handle(User $user, CarbonImmutable $today, Collection $subscriptions): array
    {
        $thisMonth = $today->startOfMonth();
        $qualifyingRuns = [$this->monthsEndingAt($thisMonth), $this->monthsEndingAt($thisMonth->subMonth())];
        $dismissed = $user->recurringDebitDismissals()->get()
            ->map(static fn (RecurringDebitDismissal $dismissal): string => "{$dismissal->label_key}:{$dismissal->amount_cents}")
            ->flip();
        $supplierNeedles = $subscriptions
            ->map(static fn (Subscription $subscription): ?string => $subscription->supplierNeedle())
            ->filter()
            ->values();

        $debits = $user->bankMovements()
            ->unlinkedDebits()
            ->whereBetween('booked_on', [$thisMonth->subMonths(self::MIN_CONSECUTIVE_MONTHS)->toDateString(), $today->toDateString()])
            ->orderBy('booked_on')
            ->orderBy('id')
            ->get()
            ->reject(fn (BankMovement $movement): bool => DetectFiscPayments::isFisc($movement->label)
                || $dismissed->has($this->fingerprint($movement))
                || NormalizeBankText::mentionsAny($movement->label, $supplierNeedles));
        $detected = [];

        foreach ($debits->groupBy($this->fingerprint(...)) as $group) {
            /** @var list<string> $seenMonths */
            $seenMonths = array_values(array_unique($group->map(static fn (BankMovement $movement): string => $movement->booked_on->format('Y-m'))->all()));

            if (! collect($qualifyingRuns)->contains(static fn (array $run): bool => array_diff($run, $seenMonths) === [])) {
                continue;
            }

            $last = $group->last();
            assert($last instanceof BankMovement);
            /** @var list<int> $days */
            $days = $group->map(static fn (BankMovement $movement): int => $movement->booked_on->day)->sort()->values()->all();

            $detected[] = new RecurringDebitData(
                label: $last->label,
                amount: MoneyData::fromMoney($last->amount_cents->absolute()),
                debitDay: $days[intdiv(count($days), 2)],
                months: $seenMonths,
                lastBookedOn: $last->booked_on,
            );
        }

        usort($detected, static fn (RecurringDebitData $a, RecurringDebitData $b): int => $b->lastBookedOn->toDateString() <=> $a->lastBookedOn->toDateString());

        return $detected;
    }

    private function fingerprint(BankMovement $movement): string
    {
        return NormalizeBankText::normalize($movement->label).':'.$movement->amount_cents->absolute()->getAmount();
    }

    /**
     * The months of a qualifying run ending on $end, oldest first.
     *
     * @return list<string>
     */
    private function monthsEndingAt(CarbonImmutable $end): array
    {
        return array_map(static fn (int $back): string => $end->subMonths($back)->format('Y-m'), range(self::MIN_CONSECUTIVE_MONTHS - 1, 0));
    }
}
