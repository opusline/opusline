<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Data\RecategorizeExpensesData;
use App\Domain\Users\Models\User;

class RecategorizeExpenses
{
    public function __construct(private readonly SelectExpenses $selectExpenses) {}

    /** @return string the `Y-m` month the moved rows live in — the journal to answer with */
    public function handle(User $user, RecategorizeExpensesData $data): string
    {
        ['expenses' => $selected, 'month' => $month] = $this->selectExpenses->handle($user, $data->expenseIds);

        $user->expenses()
            ->whereIn('id', $selected->modelKeys())
            ->update(['category' => $data->category->value]);

        return $month;
    }
}
