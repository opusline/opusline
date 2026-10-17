<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\InvoiceLineInputData;
use App\Domain\Invoices\Data\SaveQuoteDraftData;
use App\Domain\Invoices\Documents\DocumentTotals;
use App\Domain\Invoices\Documents\PaymentTerm;
use App\Domain\Invoices\Enums\QuoteStatus;
use App\Domain\Invoices\Models\Quote;
use App\Domain\Shared\Data\SignedMoneyData;
use App\Domain\Shared\Validation\AccountCurrency;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Creates or updates a quote drafted in Opusline. A draft has no number and
 * is the account's alone to change; its lines are replaced wholesale on every
 * save, and the header totals recomputed from them, as an invoice draft's are.
 */
class SaveQuoteDraft
{
    public function __construct(private readonly ValidateInvoice $validateInvoice) {}

    public function handle(User $user, SaveQuoteDraftData $data, ?Quote $quote = null): Quote
    {
        abort_if($quote instanceof Quote && $quote->status !== QuoteStatus::Draft, 409, __('quotes.not_a_draft'));

        $this->validateInvoice->forQuoteDraft($user, $data);

        $settings = $user->settingsOrFail();
        $client = $user->clients()->whereKey($data->clientId)->firstOrFail();
        $currency = $settings->currency->value;
        $vatApplies = $settings->vat_regime->isLiable();
        $lines = array_map(static fn (InvoiceLineInputData $line): array => [
            'quantityMilli' => $line->quantityMilli,
            'unitPrice' => $line->unitPrice->toMoney(),
            'vatRateBp' => $vatApplies ? $line->vatRateBp : 0,
        ], $data->lines);
        $totals = DocumentTotals::of($lines, $currency);

        if ($totals->ht->isNegative() || $totals->ttc->isNegative()) {
            throw ValidationException::withMessages(['lines' => __('quotes.negative_total')]);
        }

        $issuedOn = $data->issuedOn === null ? $settings->today() : CarbonImmutable::parse($data->issuedOn);
        $term = new PaymentTerm($data->paymentTermsDays, $data->paymentTermsEndOfMonth);
        $attributes = [
            'client_id' => $client->id,
            'mission_id' => $data->missionId,
            'title' => blank($data->title) ? null : trim($data->title),
            'description' => blank($data->description) ? null : trim($data->description),
            'language' => $data->language,
            'issued_on' => $issuedOn,
            'validity_days' => $data->validityDays,
            'valid_until' => $issuedOn->addDays($data->validityDays),
            'deposit_rate_bp' => $data->depositRateBp,
            'payment_terms_days' => $term->days,
            'payment_terms_end_of_month' => $term->endOfMonth,
            'show_email' => $data->showEmail,
            'custom_mentions' => blank($data->customMentions) ? null : trim($data->customMentions),
            'currency' => $currency,
            'amount_ht_cents' => $totals->ht,
            'amount_ttc_cents' => $totals->ttc,
            'vat_rate_bp' => $totals->dominantRateBp($settings->effectiveVatRateBp($client->default_vat_rate_bp)),
        ];

        return DB::transaction(function () use ($user, $data, $quote, $attributes, $lines, $totals, $currency): Quote {
            // Validating takes the same lock: a save that waited behind it must
            // find the quote numbered and stop, not rewrite the filed PDF's lines.
            if ($quote instanceof Quote) {
                User::lockRow($user->id);
                abort_if($quote->refresh()->status !== QuoteStatus::Draft, 409, __('quotes.not_a_draft'));
            }

            AccountCurrency::assertAllMatchAccountUnderLock(
                $user->id,
                ...array_map(static fn (InvoiceLineInputData $line): SignedMoneyData => $line->unitPrice, $data->lines),
            );

            if ($quote instanceof Quote) {
                $quote->update($attributes);
                $quote->lines()->delete();
            } else {
                $quote = $user->quotes()->create([...$attributes, 'status' => QuoteStatus::Draft]);
            }

            foreach ($data->lines as $position => $line) {
                $quote->lines()->create([
                    'position' => $position,
                    'label' => trim($line->label),
                    'detail' => blank($line->detail) ? null : trim($line->detail),
                    'quantity_milli' => $line->quantityMilli,
                    'unit' => $line->unit,
                    'currency' => $currency,
                    'unit_price_cents' => $lines[$position]['unitPrice'],
                    'vat_rate_bp' => $lines[$position]['vatRateBp'],
                    'total_ht_cents' => $totals->lineTotals[$position],
                ]);
            }

            return $quote->load('lines');
        });
    }
}
