<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Documents\Actions\StoreGeneratedDocument;
use App\Domain\Documents\Enums\DocumentCategory;
use App\Domain\Invoices\Data\IssueCreditNoteData;
use App\Domain\Invoices\Documents\DocumentParties;
use App\Domain\Invoices\Enums\CreditNoteSettlement;
use App\Domain\Invoices\Enums\CreditNoteStatus;
use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Lifecycle\Invoice\InvoiceCancelled;
use App\Domain\Invoices\Lifecycle\Invoice\InvoicePaid;
use App\Domain\Invoices\Models\CreditNote;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Validation\ValidationException;

/**
 * Issues a credit note on an invoice: numbered from the credit notes' own
 * continuous series, dated today, its parties copied, its PDF filed with the
 * client's documents. There is no draft and no deletion: an issued credit
 * note is part of the record, as the invoice is.
 *
 * The invoice follows: taken back whole before any payment, it is cancelled;
 * once what is left to pay reaches zero with money received, it is paid.
 */
class IssueCreditNote
{
    public function __construct(
        private readonly LockInvoice $lockInvoice,
        private readonly ComposeCreditNote $composeCreditNote,
        private readonly SuggestCreditNoteNumber $suggestCreditNoteNumber,
        private readonly RecordInvoiceEvent $recordInvoiceEvent,
        private readonly RenderCreditNotePdf $renderCreditNotePdf,
        private readonly StoreGeneratedDocument $storeGeneratedDocument,
    ) {}

    public function handle(User $user, Invoice $invoice, IssueCreditNoteData $data): CreditNote
    {
        return $this->lockInvoice->handle($invoice, function (Invoice $locked) use ($user, $data): CreditNote {
            $draft = $this->composeCreditNote->handle($locked, $data);
            $settings = $user->settingsOrFail();
            $issuedOn = $settings->today();
            $locked->loadMissing('client');
            $settlesNow = ! $draft->settlement->returnsMoney();

            try {
                $creditNote = $user->creditNotes()->create([
                    'invoice_id' => $locked->id,
                    'client_id' => $locked->client_id,
                    'number' => $this->suggestCreditNoteNumber->handle($user),
                    'status' => $settlesNow ? CreditNoteStatus::Settled : CreditNoteStatus::Issued,
                    'kind' => $draft->kind,
                    'reason' => $draft->reason,
                    'detail' => $draft->detail,
                    'settlement' => $draft->settlement,
                    'language' => $draft->language,
                    'issued_on' => $issuedOn,
                    'settled_on' => $settlesNow ? $issuedOn : null,
                    'seller_snapshot' => DocumentParties::seller($settings, false, false),
                    'buyer_snapshot' => $locked->buyer_snapshot ?? DocumentParties::buyer($locked->client),
                    'currency' => $locked->currency,
                    'amount_ht_cents' => $draft->totals->ht,
                    'amount_ttc_cents' => $draft->totals->ttc,
                    'vat_rate_bp' => $draft->totals->dominantRateBp($locked->vat_rate_bp),
                ]);
            } catch (UniqueConstraintViolationException) {
                throw ValidationException::withMessages(['number' => __('credit_notes.number_taken')]);
            }

            foreach ($draft->lines as $position => $line) {
                $creditNote->lines()->create([
                    'invoice_line_id' => $line['invoiceLineId'],
                    'position' => $position,
                    'label' => $line['label'],
                    'detail' => $line['detail'],
                    'quantity_milli' => $line['quantityMilli'],
                    'unit' => $line['unit'],
                    'currency' => $locked->currency,
                    'unit_price_cents' => $line['unitPrice'],
                    'vat_rate_bp' => $line['vatRateBp'],
                    'total_ht_cents' => $draft->totals->lineTotals[$position],
                ]);
            }

            $this->recordInvoiceEvent->handle($locked, InvoiceEventKind::CreditNoteIssued, $issuedOn, $creditNote->number);
            $this->follow($locked, $draft->settlement, $issuedOn);

            $this->storeGeneratedDocument->handle(
                $locked->client,
                $this->renderCreditNotePdf->handle($creditNote, $draft->language),
                $this->renderCreditNotePdf->fileName($creditNote, $draft->language),
                DocumentCategory::IssuedInvoice,
                $creditNote->documentProperties(),
            );

            return $creditNote->load('lines');
        });
    }

    private function follow(Invoice $invoice, CreditNoteSettlement $settlement, CarbonImmutable $issuedOn): void
    {
        if ($settlement === CreditNoteSettlement::CancelsInvoice) {
            $invoice->lifecycle->transitionTo(InvoiceCancelled::class);

            return;
        }

        // Money received now covers what is left: the credit note paid it off.
        if ($invoice->status === InvoiceStatus::Sent && ! $invoice->balanceDue()->isPositive()) {
            $invoice->lifecycle->transitionTo(InvoicePaid::class);
            $this->recordInvoiceEvent->handle($invoice, InvoiceEventKind::Paid, $issuedOn);
        }
    }
}
