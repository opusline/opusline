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

    public function __construct(private readonly ValidateVatRate $validateVatRate) {}

    /**
     * A cosmetic edit never moves the deduction; one that changes what the
     * CA3 sees re-claims it from the purchase month.
     */
    public function handle(Expense $expense, ExpenseInputData $data): Expense
    {
        $this->validateVatRate->handle($data->vatTreatment, $data->vatRateBp);

        return DB::transaction(function () use ($expense, $data): Expense {
            AccountCurrency::assertMatchesAccountUnderLock($expense->user_id, $data->amountTtc);

            // Re-read under lock: a deferral or a receipt racing this edit
            // would otherwise have its claim period overwritten with a stale one.
            $locked = Expense::query()->whereKey($expense->id)->lockForUpdate()->firstOrFail();
            $deferredByHand = $locked->isDeferred();
            $locked->fill(ExpenseAttributes::from($data));

            if ($locked->isDirty(self::VAT_COLUMNS)) {
                $locked->vat_claim_period = DeclaredCa3Months::of($locked->user_id)
                    ->reclaim($data->month(), $locked->vat_claim_period, $deferredByHand);
            }

            $locked->save();

            return $locked;
        });
    }
}
