<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Data\RecategorizeExpensesData;
use App\Domain\Expenses\Models\Expense;
use App\Domain\Users\Models\User;
use Illuminate\Validation\ValidationException;

class RecategorizeExpenses
{
    /**
     * @return string the `Y-m` month the moved rows live in — the journal to answer with
     *
     * @throws ValidationException when the selection spans several months; a foreign id is a 404
     */
    public function handle(User $user, RecategorizeExpensesData $data): string
    {
        $ids = array_values(array_unique($data->expenseIds));
        $selected = $user->expenses()->whereIn('id', $ids)->get(['id', 'spent_on']);

        // A foreign id reads as absent, like any resource that is not the
        // user's — one query answers both "is it mine" and "which month".
        abort_if($selected->count() !== count($ids), 404, __('expenses.unknown_expense'));

        $months = $selected->map(fn (Expense $expense): string => $expense->month())->unique();

        // The bulk bar only ever selects within one journal; a selection that
        // spans months has no single screen to answer with.
        if ($months->count() !== 1) {
            throw ValidationException::withMessages(['expenseIds' => __('expenses.mixed_months')]);
        }

        $user->expenses()
            ->whereIn('id', $ids)
            ->update(['category' => $data->category->value]);

        return $months->sole();
    }
}
