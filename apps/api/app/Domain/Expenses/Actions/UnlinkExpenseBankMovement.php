<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Models\Expense;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

class UnlinkExpenseBankMovement
{
    /** Under the account lock, like every other bank writer. */
    public function handle(Expense $expense): void
    {
        DB::transaction(function () use ($expense): void {
            User::lockRow($expense->user_id);

            $expense->bankMovement()->update(['expense_id' => null]);
        });
    }
}
