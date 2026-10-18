<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\InvoiceLineInputData;
use App\Domain\Invoices\Data\SaveInvoiceDraftData;
use App\Domain\Invoices\Documents\DocumentTotals;
use App\Domain\Invoices\Documents\PaymentTerm;
use App\Domain\Invoices\Enums\CreditNoteSettlement;
use App\Domain\Invoices\Enums\CreditNoteStatus;
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
        private readonly LinkInvoiceTimeEntries $linkInvoiceTimeEntries,
    ) {}

    public function handle(User $user, SaveInvoiceDraftData $data, ?Invoice $invoice = null): Invoice
    {
        if ($invoice instanceof Invoice) {
            $this->assertOpuslineDraft($invoice);
        }

        $this->validateInvoice->forDraft($user, $data);

        $settings = $user->settingsOrFail();
        $client = $user->clients()->whereKey($data->clientId)->firstOrFail();
        $currency = $settings->currency->value;
        $vatApplies = $settings->vat_regime->isLiable();
        $lines = array_map(static fn (InvoiceLineInputData $line): array => $line->priced($vatApplies), $data->lines);
        $totals = DocumentTotals::of($lines, $currency);

        // The header amounts are unsigned, and a negative invoice is an avoir, not an invoice.
        if ($totals->isNegative()) {
            throw ValidationException::withMessages(['lines' => __('invoices.negative_total')]);
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
            // Issuing takes the same lock: a save that waited behind it must
            // find the invoice numbered and stop, not rewrite the filed PDF's lines.
            if ($invoice instanceof Invoice) {
                User::lockRow($user->id);
                $this->assertOpuslineDraft($invoice->refresh());
            }

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

            // The covered time follows the draft: what it no longer imports goes
            // back to unbilled, what it imports is marked as billed by it.
            $invoice->timeEntries()->whereNotIn('id', $data->timeEntryIds)->update(['invoice_id' => null]);
            $this->linkInvoiceTimeEntries->handle($invoice, $data->timeEntryIds);
            $this->claimCreditNotes($user, $invoice, $data->creditNoteIds);

            return $invoice->load('lines');
        });
    }

    private function assertOpuslineDraft(Invoice $invoice): void
    {
        abort_if(
            ! $invoice->isWrittenInOpusline() || $invoice->status !== InvoiceStatus::Draft,
            409,
            __('invoices.not_an_opusline_draft'),
        );
    }

    /**
     * The credit notes the draft deducts follow it, as its tracked time does:
     * only the same client's, waiting to be deducted, not claimed by another draft.
     *
     * @param  list<int>  $creditNoteIds
     *
     * @throws ValidationException
     */
    private function claimCreditNotes(User $user, Invoice $invoice, array $creditNoteIds): void
    {
        $invoice->deductedCreditNotes()->whereNotIn('id', $creditNoteIds)->update(['deduction_invoice_id' => null]);

        if ($creditNoteIds === []) {
            return;
        }

        $claimable = $user->creditNotes()
            ->whereKey($creditNoteIds)
            ->where('client_id', $invoice->client_id)
            ->where('status', CreditNoteStatus::Issued)
            ->where('settlement', CreditNoteSettlement::DeductFromNextInvoice)
            ->where(fn ($query) => $query->whereNull('deduction_invoice_id')->orWhere('deduction_invoice_id', $invoice->id))
            ->pluck('id');

        if ($claimable->count() !== count($creditNoteIds)) {
            throw ValidationException::withMessages(['creditNoteIds' => __('credit_notes.not_deductible')]);
        }

        $user->creditNotes()->whereKey($creditNoteIds)->update(['deduction_invoice_id' => $invoice->id]);
    }
}
