<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Models\Expense;

/**
 * Removes the purchase and its receipt. A subscription's debit leaves a
 * tombstone behind — the bank did not take it, and the next read must not
 * write it again — where a purchase entered by hand simply goes.
 */
class DeleteExpense
{
    public function handle(Expense $expense): void
    {
        $expense->clearMediaCollection(Expense::RECEIPT_COLLECTION);

        if ($expense->subscription_id === null) {
            $expense->forceDelete();

            return;
        }

        $expense->delete();
    }
}
