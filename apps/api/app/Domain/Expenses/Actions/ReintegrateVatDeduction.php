<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Models\Expense;
use App\Domain\Expenses\Vat\DeclaredCa3Months;

/**
 * « Réintégrer dans la CA3 »: the deduction goes back to the purchase's own
 * month — or, if that month was declared meanwhile, to the first open one.
 */
class ReintegrateVatDeduction
{
    public function handle(Expense $expense): void
    {
        abort_if(! $expense->hasDeductibleVat(), 409, __('expenses.vat_locked'));

        $declared = DeclaredCa3Months::of($expense->user_id);

        abort_if($declared->isDeclared($expense->vat_claim_period), 409, __('expenses.vat_already_declared'));

        $expense->update(['vat_claim_period' => $declared->claimFor($expense->month())]);
    }
}
