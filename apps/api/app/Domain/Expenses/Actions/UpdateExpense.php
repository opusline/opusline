<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Data\ExpenseInputData;
use App\Domain\Expenses\Models\Expense;
use App\Domain\Expenses\Vat\DeclaredCa3Months;
use App\Domain\Shared\Validation\AccountCurrency;
use Illuminate\Support\Facades\DB;

class UpdateExpense
{
    private const array VAT_COLUMNS = ['spent_on', 'amount_ttc_cents', 'vat_treatment', 'vat_rate_bp', 'pro_share_bp'];

    public function __construct(private readonly ValidateExpense $validateExpense) {}

    /**
     * A cosmetic edit never moves the deduction; one that changes what the
     * CA3 sees re-claims it from the purchase month.
     */
    public function handle(Expense $expense, ExpenseInputData $data): Expense
    {
        $this->validateExpense->handle($data);

        return DB::transaction(function () use ($expense, $data): Expense {
            AccountCurrency::assertMatchesAccountUnderLock($expense->user_id, $data->amountTtc);

            $expense->fill(ExpenseAttributes::from($data));

            if ($expense->isDirty(self::VAT_COLUMNS)) {
                $expense->vat_claim_period = DeclaredCa3Months::of($expense->user_id)
                    ->reclaim($data->month(), $expense->vat_claim_period);
            }

            $expense->save();

            return $expense;
        });
    }
}
