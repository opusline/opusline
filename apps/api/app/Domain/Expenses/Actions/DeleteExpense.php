<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Models\Expense;

class DeleteExpense
{
    public function handle(Expense $expense): void
    {
        $expense->delete();
    }
}
