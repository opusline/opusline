<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Data\ExpenseSelectionData;
use App\Domain\Expenses\Vat\DeclaredCa3Months;
use App\Domain\Users\Models\User;

/**
 * « Reporter sur la prochaine CA3 »: the deduction moves to the first open
 * month after the purchase's, in one go for the whole selection.
 */
class DeferVatDeductions
{
    public function __construct(private readonly SelectExpenses $selectExpenses) {}

    /** @return string the `Y-m` month the rows were listed in */
    public function handle(User $user, ExpenseSelectionData $data): string
    {
        ['expenses' => $selected, 'month' => $month] = $this->selectExpenses->handle($user, $data->expenseIds);
        $declared = DeclaredCa3Months::of($user->id);

        foreach ($selected as $expense) {
            abort_if(! $expense->hasDeductibleVat(), 409, __('expenses.vat_locked'));
            // A deduction already filed on a declared CA3 stays where the fisc saw it.
            abort_if($declared->isDeclared($expense->vat_claim_period), 409, __('expenses.vat_already_declared'));
        }

        $user->expenses()
            ->whereIn('id', $selected->modelKeys())
            ->update(['vat_claim_period' => $declared->deferralFor($month)]);

        return $month;
    }
}
