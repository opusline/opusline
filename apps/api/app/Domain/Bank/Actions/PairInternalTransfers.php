<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Enums\BankMatchStatus;
use App\Domain\Bank\Models\BankMovement;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

/**
 * Recognizes money moved between two of the user's own bank accounts: a debit
 * on one and a credit of the same amount on another, booked a few days apart
 * at most. Both sides are neither revenue nor an expense, so they leave the
 * reconciliation queues — the credit's pending invoice suggestion included.
 *
 * Only movements nothing explains yet take part: a validated invoice or a
 * linked expense is the user's word and is never overridden.
 *
 * Runs inside the caller's transaction, after User::lockRow().
 */
class PairInternalTransfers
{
    /** A transfer between two banks is booked on both sides within this many days. */
    public const int DAYS_APART = 3;

    /**
     * @param  CarbonImmutable  $windowStart  the earliest day the new movements cover
     * @return int the number of pairs made
     */
    public function handle(User $locked, CarbonImmutable $windowStart): int
    {
        if ($locked->bankAccounts()->count() < 2) {
            return 0;
        }

        $candidates = $locked->bankMovements()
            ->whereNull('transfer_counterpart_id')
            ->whereNull('invoice_id')
            ->whereNull('expense_id')
            ->where('booked_on', '>=', $windowStart->subDays(self::DAYS_APART)->toDateString())
            ->orderBy('booked_on')
            ->orderBy('id')
            ->get();

        /** @var array<int, list<BankMovement>> $creditsByCents */
        $creditsByCents = [];

        foreach ($candidates as $movement) {
            if ($movement->isCredit()) {
                $creditsByCents[(int) $movement->amount_cents->getAmount()][] = $movement;
            }
        }

        $pairedCreditIds = [];

        foreach ($candidates as $debit) {
            if ($debit->isCredit()) {
                continue;
            }

            $credit = $this->closestCounterpart($debit, $creditsByCents[-(int) $debit->amount_cents->getAmount()] ?? [], $pairedCreditIds);

            if (! $credit instanceof BankMovement) {
                continue;
            }

            $pairedCreditIds[$credit->id] = true;
            $locked->bankMovements()->whereKey($debit->id)->update(['transfer_counterpart_id' => $credit->id]);
            $locked->bankMovements()->whereKey($credit->id)->update(['transfer_counterpart_id' => $debit->id]);
        }

        if ($pairedCreditIds !== []) {
            $locked->bankMatches()
                ->whereIn('bank_movement_id', array_keys($pairedCreditIds))
                ->where('status', BankMatchStatus::Pending)
                ->delete();
        }

        return count($pairedCreditIds);
    }

    /**
     * @param  list<BankMovement>  $credits  same amount, oldest first
     * @param  array<int, true>  $pairedCreditIds
     */
    private function closestCounterpart(BankMovement $debit, array $credits, array $pairedCreditIds): ?BankMovement
    {
        $closest = null;
        $closestDays = null;

        foreach ($credits as $credit) {
            if (isset($pairedCreditIds[$credit->id]) || $credit->bank_account_id === $debit->bank_account_id) {
                continue;
            }

            $days = (int) abs($debit->booked_on->diffInDays($credit->booked_on));

            if ($days > self::DAYS_APART) {
                continue;
            }

            if ($closestDays === null || $days < $closestDays) {
                $closest = $credit;
                $closestDays = $days;
            }
        }

        return $closest;
    }
}
