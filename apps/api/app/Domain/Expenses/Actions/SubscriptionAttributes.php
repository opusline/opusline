<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Data\SubscriptionInputData;
use App\Domain\Expenses\Enums\SubscriptionPeriodicity;

/** The column values one input shape writes — shared by create and replace. */
final readonly class SubscriptionAttributes
{
    /**
     * @return array<string, mixed>
     */
    public static function from(SubscriptionInputData $data): array
    {
        $annual = $data->periodicity === SubscriptionPeriodicity::Annual;

        return [
            'supplier' => $data->supplier,
            'category' => $data->category,
            'description' => $data->description,
            'vat_treatment' => $data->vatTreatment,
            'vat_rate_bp' => $data->vatRateBp,
            'pro_share_bp' => $data->proShareBp,
            'periodicity' => $data->periodicity,
            'debit_day' => $data->debitDay,
            'debit_month' => $annual ? $data->debitMonth : null,
            'started_on' => $data->startedOn,
            'auto_create_expenses' => $data->autoCreateExpenses,
            'provision_monthly' => $annual && $data->provisionMonthly,
            'customer_space_url' => $data->customerSpaceUrl,
            'currency' => $data->amountHt->currency->value,
        ];
    }
}
