<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Models\Expense;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Removes the purchase and its receipt. A subscription's debit leaves a
 * tombstone behind — the bank did not take it, and the next read must not
 * write it again — where a purchase entered by hand simply goes. It frees
 * its debit under the account lock, like every other bank writer.
 */
class DeleteExpense
{
    public function handle(Expense $expense): void
    {
        DB::transaction(function () use ($expense): void {
            User::lockRow($expense->user_id);

            $expense->clearMediaCollection(Expense::RECEIPT_COLLECTION);
            // nullOnDelete only fires on the hard delete; a tombstone keeps the FK alive.
            $expense->bankMovement()->update(['expense_id' => null]);

            if ($expense->subscription_id === null) {
                $expense->forceDelete();

                return;
            }

            $expense->delete();
        });
    }
}
