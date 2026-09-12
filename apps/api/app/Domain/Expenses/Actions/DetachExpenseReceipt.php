<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Models\Expense;

class DetachExpenseReceipt
{
    public function handle(Expense $expense): void
    {
        $expense->clearMediaCollection(Expense::RECEIPT_COLLECTION);
    }
}
