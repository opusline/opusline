<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Bank\Actions\NormalizeBankText;
use App\Domain\Bank\Models\BankMovement;
use App\Domain\Expenses\Models\Expense;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

/**
 * Pairs debits with the purchases they paid, silently: unlike the invoice
 * side there is no suggestion to validate, because the pairing only fires
 * when it cannot be wrong — the exact TTC, within a few days, the supplier's
 * name on the label when the name is long enough to look for, and exactly
 * one purchase answering. Anything less stays for the hand.
 *
 * Runs under the account's row lock, like every bank writer; a hand link
 * that landed meanwhile is never overwritten.
 */
class SuggestExpenseMatches
{
    public const int DAYS_APART = 5;

    /**
     * @param  ?CarbonImmutable  $spentFrom  only purchases from that day and the debits near them; null for the whole account
     * @return int links made
     */
    public function handle(User $user, ?CarbonImmutable $spentFrom = null): int
    {
        $debits = $user->bankMovements()
            ->unlinkedDebits()
            ->when($spentFrom, static fn ($query, CarbonImmutable $from) => $query->where('booked_on', '>=', $from->subDays(self::DAYS_APART)->toDateString()))
            ->orderBy('booked_on')
            ->orderBy('id')
            ->get();

        if ($debits->isEmpty()) {
            return 0;
        }

        /** @var array<int, Collection<int, Expense>> $candidatesByAmount */
        $candidatesByAmount = $user->expenses()
            ->whereDoesntHave('bankMovement')
            ->when($spentFrom, static fn ($query, CarbonImmutable $from) => $query->where('spent_on', '>=', $from->toDateString()))
            ->get()
            ->groupBy(static fn (Expense $expense): int => (int) $expense->amount_ttc_cents->getAmount())
            ->all();
        $linked = 0;

        foreach ($debits as $debit) {
            $paid = (int) $debit->amount_cents->absolute()->getAmount();
            $matching = ($candidatesByAmount[$paid] ?? new Collection)
                ->filter(fn (Expense $expense): bool => $this->matches($expense, $debit));

            if ($matching->count() !== 1) {
                continue;
            }

            $expense = $matching->sole();
            $user->bankMovements()->whereKey($debit->id)->whereNull('expense_id')->update(['expense_id' => $expense->id]);
            $candidatesByAmount[$paid] = $candidatesByAmount[$paid]->reject(static fn (Expense $candidate): bool => $candidate->is($expense));
            $linked++;
        }

        return $linked;
    }

    private function matches(Expense $expense, BankMovement $debit): bool
    {
        if ($expense->currency !== $debit->currency || $expense->spent_on->diffInDays($debit->booked_on) > self::DAYS_APART) {
            return false;
        }

        $needle = NormalizeBankText::clientNeedle($expense->supplier);

        // A supplier too short to look for is matched on amount and date alone
        // — but only for a subscription's own debit, where the date is known.
        if ($needle === null) {
            return $expense->subscription_id !== null;
        }

        return NormalizeBankText::mentionsAny($debit->label, [$needle]);
    }
}
