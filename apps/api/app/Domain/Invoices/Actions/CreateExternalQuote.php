<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\CreateExternalQuoteData;
use App\Domain\Invoices\Enums\InvoiceSource;
use App\Domain\Invoices\Enums\QuoteStatus;
use App\Domain\Invoices\Models\Quote;
use App\Domain\Shared\Validation\AccountCurrency;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Records a quote another tool issued. It carries that tool's reference and
 * its own figure; Opusline follows the client's answer and what gets
 * invoiced from it, and never prints it.
 */
class CreateExternalQuote
{
    public function __construct(
        private readonly ValidateInvoice $validateInvoice,
        private readonly ComputeInvoiceAmounts $computeInvoiceAmounts,
    ) {}

    public function handle(User $user, CreateExternalQuoteData $data): Quote
    {
        if ($data->status === QuoteStatus::Draft) {
            throw ValidationException::withMessages(['status' => __('quotes.external_never_draft')]);
        }

        $this->validateInvoice->forExternalQuote($user, $data);

        $settings = $user->settingsOrFail();
        $client = $user->clients()->whereKey($data->clientId)->firstOrFail();
        $issuedOn = CarbonImmutable::parse($data->issuedOn);
        $decidedOn = $data->decidedOn === null ? $settings->today() : CarbonImmutable::parse($data->decidedOn);
        $vatRateBp = $data->vatRateBp ?? $settings->effectiveVatRateBp($client->default_vat_rate_bp);
        $amountHt = $data->amountHt->toMoney();

        if ($decidedOn->isBefore($issuedOn)) {
            throw ValidationException::withMessages(['decidedOn' => __('quotes.decided_on_before_issued')]);
        }

        $attributes = [
            'client_id' => $client->id,
            'mission_id' => $data->missionId,
            'number' => $data->number,
            'status' => $data->status,
            'source' => InvoiceSource::External,
            'title' => blank($data->title) ? null : trim($data->title),
            'language' => $settings->document_language,
            'issued_on' => $issuedOn,
            'validity_days' => $settings->quote_validity_days,
            'valid_until' => $issuedOn->addDays($settings->quote_validity_days),
            'payment_terms_days' => $settings->default_payment_terms_days,
            'payment_terms_end_of_month' => $settings->default_payment_terms_end_of_month,
            'accepted_on' => $data->status === QuoteStatus::Accepted ? $decidedOn : null,
            'refused_on' => $data->status === QuoteStatus::Refused ? $decidedOn : null,
            'currency' => $data->amountHt->currency->value,
            'amount_ht_cents' => $amountHt,
            'amount_ttc_cents' => $this->computeInvoiceAmounts->ttcFor($amountHt, $vatRateBp),
            'vat_rate_bp' => $vatRateBp,
        ];

        return DB::transaction(function () use ($user, $data, $attributes): Quote {
            AccountCurrency::assertMatchesAccountUnderLock($user->id, $data->amountHt);

            try {
                return $user->quotes()->create($attributes);
            } catch (UniqueConstraintViolationException) {
                throw ValidationException::withMessages(['number' => __('quotes.number_taken')]);
            }
        });
    }
}
