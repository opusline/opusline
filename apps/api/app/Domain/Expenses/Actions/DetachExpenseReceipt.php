<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Models\Expense;
use Illuminate\Support\Facades\DB;

class DetachExpenseReceipt
{
    /** Under the same row lock as the attach, so the two cannot interleave on one expense. */
    public function handle(Expense $expense): void
    {
        DB::transaction(function () use ($expense): void {
            $locked = Expense::query()->whereKey($expense->id)->lockForUpdate()->firstOrFail();

            $locked->clearMediaCollection(Expense::RECEIPT_COLLECTION);
        });
    }
}
