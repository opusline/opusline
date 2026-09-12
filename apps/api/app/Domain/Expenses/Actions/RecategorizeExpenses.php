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
     * @throws ValidationException when an id is not the user's, or the selection spans several months
     */
    public function handle(User $user, RecategorizeExpensesData $data): string
    {
        $ids = array_values(array_unique($data->expenseIds));
        $selected = $user->expenses()->whereIn('id', $ids)->get(['id', 'spent_on']);

        // A foreign id is a 422, never a silent skip — one query answers both
        // "is it mine" and "which month", where an exists rule would add a third.
        if ($selected->count() !== count($ids)) {
            throw ValidationException::withMessages(['expenseIds' => __('expenses.unknown_expense')]);
        }

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
