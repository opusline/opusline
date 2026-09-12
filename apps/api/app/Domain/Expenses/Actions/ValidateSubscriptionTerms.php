<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Data\SubscriptionInputData;
use App\Domain\Expenses\Enums\SubscriptionPeriodicity;
use Illuminate\Validation\ValidationException;

/**
 * What one field says about another: the TVA rate must fit the treatment,
 * and an annual subscription must say which month it debits in — without
 * it there is no date to schedule.
 */
class ValidateSubscriptionTerms
{
    public function __construct(private readonly ValidateVatRate $validateVatRate) {}

    /**
     * @throws ValidationException
     */
    public function handle(SubscriptionInputData $data): void
    {
        $this->validateVatRate->handle($data->vatTreatment, $data->vatRateBp);

        if ($data->periodicity === SubscriptionPeriodicity::Annual && $data->debitMonth === null) {
            throw ValidationException::withMessages(['debitMonth' => __('rules.subscription_debit_month')]);
        }
    }
}
