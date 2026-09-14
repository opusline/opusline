<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Models\Expense;
use App\Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

/**
 * The rows behind a bulk action: the user's own, and all in one month, so the
 * answer can be the journal the bar was shown on.
 */
class SelectExpenses
{
    /**
     * @param  list<int>  $ids
     * @return array{expenses: Collection<int, Expense>, month: string}
     *
     * @throws ValidationException when the selection spans several months; a foreign id is a 404
     */
    public function handle(User $user, array $ids): array
    {
        $ids = array_values(array_unique($ids));
        $selected = $user->expenses()->whereIn('id', $ids)->get();

        // A foreign id reads as absent, like any resource that is not the
        // user's — one query answers both "is it mine" and "which month".
        abort_if($selected->count() !== count($ids), 404, __('expenses.unknown_expense'));

        $months = $selected->map(fn (Expense $expense): string => $expense->month())->unique();

        if ($months->count() !== 1) {
            throw ValidationException::withMessages(['expenseIds' => __('expenses.mixed_months')]);
        }

        return ['expenses' => $selected, 'month' => $months->sole()];
    }
}
