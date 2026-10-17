<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\CreditNotes\CreditNoteDraft;
use App\Domain\Invoices\Data\InvoicePaperData;
use App\Domain\Invoices\Documents\CreditedInvoice;
use App\Domain\Invoices\Documents\DocumentFormatter;
use App\Domain\Invoices\Documents\DocumentParties;
use App\Domain\Invoices\Documents\PaperBuilder;
use App\Domain\Invoices\Documents\PaperDocument;
use App\Domain\Invoices\Documents\PaymentTerm;
use App\Domain\Invoices\Enums\CreditNoteReason;
use App\Domain\Invoices\Enums\CreditNoteSettlement;
use App\Domain\Invoices\Enums\DocumentKind;
use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Invoices\Enums\OperationCategory;
use App\Domain\Invoices\Models\CreditNote;
use App\Domain\Invoices\Models\CreditNoteLine;
use App\Domain\Invoices\Models\Invoice;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;

/**
 * A credit note's printed sheet: the invoice's layout, naming the invoice it
 * relates to, its reason and what becomes of its amount. An issued credit
 * note prints the parties it went out with; the editor's preview prints the
 * invoice's, under a stamp.
 *
 * @phpstan-import-type Party from DocumentParties
 */
class BuildCreditNotePaper
{
    public function __construct(private readonly PaperBuilder $paperBuilder) {}

    public function forCreditNote(CreditNote $creditNote, DocumentLanguage $language): InvoicePaperData
    {
        $creditNote->loadMissing(['invoice', 'lines', 'user.settings', 'user.media']);
        $settings = $creditNote->user->settingsOrFail();

        /** @var Party $seller */
        $seller = $creditNote->seller_snapshot;
        /** @var Party $buyer */
        $buyer = $creditNote->buyer_snapshot;

        return $this->paperBuilder->build($this->document(
            invoice: $creditNote->invoice,
            number: $creditNote->number,
            issuedOn: $creditNote->issued_on,
            seller: $seller,
            buyer: $buyer,
            lines: array_values($creditNote->lines->map(static fn (CreditNoteLine $line): array => [
                'label' => $line->label,
                'detail' => $line->detail,
                'quantityMilli' => $line->quantity_milli,
                'unit' => $line->unit,
                'unitPrice' => $line->unit_price_cents,
                'vatRateBp' => $line->vat_rate_bp,
            ])->all()),
            detail: $creditNote->detail,
            reason: $creditNote->reason,
            settlement: $creditNote->settlement,
        ), new DocumentFormatter($language, $settings->date_format), null);
    }

    /** The sheet the editor previews before the credit note is issued. */
    public function forDraft(Invoice $invoice, CreditNoteDraft $draft): InvoicePaperData
    {
        $invoice->loadMissing(['client', 'user.settings', 'user.media']);
        $settings = $invoice->user->settingsOrFail();

        /** @var Party $buyer */
        $buyer = $invoice->buyer_snapshot ?? DocumentParties::buyer($invoice->client);

        return $this->paperBuilder->build($this->document(
            invoice: $invoice,
            number: null,
            issuedOn: $settings->today(),
            seller: DocumentParties::seller($settings, false, false),
            buyer: $buyer,
            lines: array_map(static fn (array $line): array => [
                'label' => $line['label'],
                'detail' => $line['detail'],
                'quantityMilli' => $line['quantityMilli'],
                'unit' => $line['unit'],
                'unitPrice' => $line['unitPrice'],
                'vatRateBp' => $line['vatRateBp'],
            ], $draft->lines),
            detail: $draft->detail,
            reason: $draft->reason,
            settlement: $draft->settlement,
        ), new DocumentFormatter($draft->language, $settings->date_format), 'draft');
    }

    /**
     * @param  Party  $seller
     * @param  Party  $buyer
     * @param  list<array{label: string, detail: ?string, quantityMilli: int, unit: LineUnit, unitPrice: Money, vatRateBp: int}>  $lines
     */
    private function document(
        Invoice $invoice,
        ?string $number,
        CarbonImmutable $issuedOn,
        array $seller,
        array $buyer,
        array $lines,
        ?string $detail,
        CreditNoteReason $reason,
        CreditNoteSettlement $settlement,
    ): PaperDocument {
        return new PaperDocument(
            kind: DocumentKind::CreditNote,
            number: $number,
            issuedOn: $issuedOn,
            dueOn: null,
            validUntil: null,
            periodStart: null,
            periodEnd: null,
            title: $invoice->title,
            description: $detail,
            operationCategory: $invoice->operation_category ?? OperationCategory::Services,
            seller: $seller,
            buyer: $buyer,
            lines: $lines,
            currency: $invoice->currency,
            term: new PaymentTerm(0, false),
            latePenaltyRateBp: null,
            depositRateBp: null,
            showIban: false,
            vatOnDebits: false,
            customMentions: null,
            hasLogo: $invoice->user->hasMedia('company_logo'),
            creditedInvoice: new CreditedInvoice((string) $invoice->number, $invoice->issued_on),
            creditNoteReason: $reason,
            creditNoteSettlement: $settlement,
        );
    }
}
