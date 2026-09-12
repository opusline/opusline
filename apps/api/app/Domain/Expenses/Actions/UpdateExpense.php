<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Data\ExpenseInputData;
use App\Domain\Expenses\Models\Expense;
use App\Domain\Expenses\Vat\DeclaredCa3Months;
use App\Domain\Shared\Validation\AccountCurrency;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class UpdateExpense
{
    private const array VAT_COLUMNS = ['spent_on', 'amount_ttc_cents', 'vat_treatment', 'vat_rate_bp', 'pro_share_bp'];

    public function __construct(private readonly ValidateVatRate $validateVatRate) {}

    /**
     * A cosmetic edit never moves the deduction; one that changes what the
     * CA3 sees re-claims it from the purchase month.
     */
    public function handle(Expense $expense, ExpenseInputData $data): Expense
    {
        $this->validateVatRate->handle($data->vatTreatment, $data->vatRateBp);

        // A debit's tie to its subscription is fixed at creation: the sheet
        // may echo the one in place, but moving it would orphan the period.
        if ($data->recurringDebitDay !== null || ($data->subscriptionId !== null && $data->subscriptionId !== $expense->subscription_id)) {
            throw ValidationException::withMessages(['subscriptionId' => __('expenses.link_on_create_only')]);
        }

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
