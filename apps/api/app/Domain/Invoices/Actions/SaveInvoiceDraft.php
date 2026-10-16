<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\InvoiceLineInputData;
use App\Domain\Invoices\Data\SaveInvoiceDraftData;
use App\Domain\Invoices\Documents\DocumentTotals;
use App\Domain\Invoices\Documents\PaymentTerm;
use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Invoices\Enums\InvoiceSource;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Shared\Data\SignedMoneyData;
use App\Domain\Shared\Validation\AccountCurrency;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Creates or updates an invoice drafted in Opusline. A draft has no number
 * and is the account's alone to change; its lines are replaced wholesale on
 * every save, and the header totals recomputed from them.
 */
class SaveInvoiceDraft
{
    public function __construct(
        private readonly ValidateInvoice $validateInvoice,
        private readonly RecordInvoiceEvent $recordInvoiceEvent,
    ) {}

    public function handle(User $user, SaveInvoiceDraftData $data, ?Invoice $invoice = null): Invoice
    {
        abort_if(
            $invoice instanceof Invoice && (! $invoice->isWrittenInOpusline() || $invoice->status !== InvoiceStatus::Draft),
            409,
            __('invoices.not_an_opusline_draft'),
        );

        $this->validateInvoice->forDraft($user, $data);

        $settings = $user->settingsOrFail();
        $client = $user->clients()->whereKey($data->clientId)->firstOrFail();
        $currency = $settings->currency->value;
        // Under the franchise no line carries VAT, whatever the editor sent.
        $vatApplies = $settings->vat_regime->isLiable();
        $lines = array_map(static fn (InvoiceLineInputData $line): array => [
            'quantityMilli' => $line->quantityMilli,
            'unitPrice' => $line->unitPrice->toMoney(),
            'vatRateBp' => $vatApplies ? $line->vatRateBp : 0,
        ], $data->lines);
        $totals = DocumentTotals::of($lines, $currency);
        $this->assertTotalsNotNegative($totals);
        $issuedOn = $data->issuedOn === null ? $settings->today() : CarbonImmutable::parse($data->issuedOn);
        $term = new PaymentTerm($data->paymentTermsDays, $data->paymentTermsEndOfMonth);

        $attributes = [
            'client_id' => $client->id,
            'mission_id' => $data->missionId,
            'title' => blank($data->title) ? null : trim($data->title),
            'description' => blank($data->description) ? null : trim($data->description),
            'language' => $data->language,
            'issued_on' => $issuedOn,
            'due_on' => $term->dueOn($issuedOn),
            'payment_terms_days' => $term->days,
            'payment_terms_end_of_month' => $term->endOfMonth,
            'late_penalty_rate_bp' => $data->latePenaltyRateBp,
            'show_iban' => $data->showIban,
            'show_email' => $data->showEmail,
            'custom_mentions' => blank($data->customMentions) ? null : trim($data->customMentions),
            'period_start' => $data->periodStart,
            'period_end' => $data->periodEnd,
            'currency' => $currency,
            'amount_ht_cents' => $totals->ht,
            'amount_ttc_cents' => $totals->ttc,
            'vat_rate_bp' => $totals->dominantRateBp($settings->effectiveVatRateBp($client->default_vat_rate_bp)),
        ];

        return DB::transaction(function () use ($user, $data, $invoice, $attributes, $lines, $totals, $issuedOn, $currency): Invoice {
            AccountCurrency::assertAllMatchAccountUnderLock(
                $user->id,
                ...array_map(static fn (InvoiceLineInputData $line): SignedMoneyData => $line->unitPrice, $data->lines),
            );

            if ($invoice instanceof Invoice) {
                $invoice->update($attributes);
                $invoice->lines()->delete();
            } else {
                $invoice = $user->invoices()->create([
                    ...$attributes,
                    'source' => InvoiceSource::Opusline,
                    'status' => InvoiceStatus::Draft,
                ]);
                $this->recordInvoiceEvent->handle($invoice, InvoiceEventKind::Created, $issuedOn);
            }

            foreach ($data->lines as $position => $line) {
                $invoice->lines()->create([
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

            return $invoice->load('lines');
        });
    }

    /**
     * A deduction line may lower the total, never turn it negative: the header
     * amounts are unsigned, and a negative invoice is an avoir, not an invoice.
     */
    private function assertTotalsNotNegative(DocumentTotals $totals): void
    {
        if ($totals->ht->isNegative() || $totals->ttc->isNegative()) {
            throw ValidationException::withMessages([
                'lines' => __('invoices.negative_total'),
            ]);
        }
    }
}
