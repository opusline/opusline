<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Data\ExpenseInputData;
use App\Domain\Expenses\Models\Expense;
use App\Domain\Shared\Validation\AccountCurrency;
use Illuminate\Support\Facades\DB;

class UpdateExpense
{
    public function __construct(private readonly ValidateExpense $validateExpense) {}

    public function handle(Expense $expense, ExpenseInputData $data): Expense
    {
        $this->validateExpense->handle($data);

        return DB::transaction(function () use ($expense, $data): Expense {
            AccountCurrency::assertMatchesAccountUnderLock($expense->user_id, $data->amountTtc);

            $expense->update(ExpenseAttributes::from($data));

            return $expense;
        });
    }
}
