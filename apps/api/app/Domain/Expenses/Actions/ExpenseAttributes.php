<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Data\ExpenseInputData;
use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Expenses\Vat\ExpenseAmounts;

/**
 * The column values one input shape writes — shared by create and replace so
 * the HT derivation cannot be spelled twice.
 */
final readonly class ExpenseAttributes
{
    /**
     * @return array{
     *     supplier: string,
     *     category: ExpenseCategory,
     *     description: ?string,
     *     spent_on: string,
     *     vat_treatment: ExpenseVatTreatment,
     *     vat_rate_bp: int,
     *     pro_share_bp: int,
     *     currency: string,
     *     amount_ttc_cents: int,
     *     amount_ht_cents: int
     * }
     */
    public static function from(ExpenseInputData $data): array
    {
        $amounts = ExpenseAmounts::fromTtc($data->amountTtc->toMoney(), $data->vatTreatment, $data->vatRateBp);

        return [
            'supplier' => $data->supplier,
            'category' => $data->category,
            'description' => $data->description,
            'spent_on' => $data->spentOn,
            'vat_treatment' => $data->vatTreatment,
            'vat_rate_bp' => $data->vatRateBp,
            'pro_share_bp' => $data->proShareBp,
            // Currency before the cents keys: MoneyIntegerCast reads it when
            // it writes the amounts.
            'currency' => $data->amountTtc->currency->value,
            'amount_ttc_cents' => $data->amountTtc->amount,
            'amount_ht_cents' => (int) $amounts->ht->getAmount(),
        ];
    }
}
