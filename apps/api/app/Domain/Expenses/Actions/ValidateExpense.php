<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Data\ExpenseInputData;
use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use Illuminate\Validation\ValidationException;

/**
 * An exempt purchase carries no rate and a reverse charge needs one — a 20 %
 * exempt purchase or a 0 % autoliquidation would each be a lie the CA3
 * arithmetic cannot detect later. A domestic purchase may carry 0 %: an
 * account under the franchise en base records receipts without tracking
 * their TVA at all.
 */
class ValidateExpense
{
    /**
     * @throws ValidationException
     */
    public function handle(ExpenseInputData $data): void
    {
        $consistent = match ($data->vatTreatment) {
            ExpenseVatTreatment::Exempt => $data->vatRateBp === 0,
            ExpenseVatTreatment::ReverseChargeEu,
            ExpenseVatTreatment::ReverseChargeNonEu => $data->vatRateBp > 0,
            ExpenseVatTreatment::Domestic => true,
        };

        if (! $consistent) {
            throw ValidationException::withMessages(['vatRateBp' => __('rules.expense_vat_rate')]);
        }
    }
}
