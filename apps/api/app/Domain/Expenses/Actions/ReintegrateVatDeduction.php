<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Models\Expense;
use App\Domain\Expenses\Vat\DeclaredCa3Months;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * « Réintégrer dans la CA3 »: the deduction goes back to the purchase's own
 * month — or, if that month was declared meanwhile, to the first open one.
 */
class ReintegrateVatDeduction
{
    public function handle(Expense $expense): void
    {
        abort_if(! $expense->hasDeductibleVat(), 409, __('expenses.vat_locked'));

        DB::transaction(function () use ($expense): void {
            User::lockRow($expense->user_id);
            $locked = Expense::query()->whereKey($expense->id)->lockForUpdate()->firstOrFail();
            $declared = DeclaredCa3Months::of($locked->user_id);

            abort_if($declared->isDeclared($locked->vat_claim_period), 409, __('expenses.vat_already_declared'));

            $locked->update(['vat_claim_period' => $declared->claimFor($locked->month())]);
        });
    }
}
