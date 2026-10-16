<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\InvoicePaperData;
use App\Domain\Invoices\Data\SaveInvoiceDraftData;
use App\Domain\Invoices\Documents\DocumentFormatter;
use App\Domain\Invoices\Documents\DocumentParties;
use App\Domain\Invoices\Documents\PaperBuilder;
use App\Domain\Invoices\Documents\PaperDocument;
use App\Domain\Invoices\Documents\PaymentTerm;
use App\Domain\Invoices\Enums\DocumentKind;
use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Enums\OperationCategory;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Models\InvoiceLine;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

/**
 * Resolves an invoice into its printed sheet (InvoicePaperData), in the
 * language asked for. A draft prints the account's live identity under a
 * « Brouillon » stamp; an issued invoice prints the parties it was issued
 * with.
 *
 * @phpstan-import-type Party from DocumentParties
 */
class BuildInvoicePaper
{
    public function __construct(private readonly PaperBuilder $paperBuilder) {}

    public function forInvoice(Invoice $invoice, DocumentLanguage $language): InvoicePaperData
    {
        $invoice->loadMissing(['client', 'lines', 'user.settings', 'user.media']);
        $user = $invoice->user;
        $settings = $user->settingsOrFail();
        $isIssued = $invoice->status->isIssued();

        /** @var Party $seller */
        $seller = $isIssued && $invoice->seller_snapshot !== null
            ? $invoice->seller_snapshot
            : DocumentParties::seller($settings, $invoice->show_iban, $invoice->show_email);
        /** @var Party $buyer */
        $buyer = $isIssued && $invoice->buyer_snapshot !== null
            ? $invoice->buyer_snapshot
            : DocumentParties::buyer($invoice->client);

        return $this->paperBuilder->build(new PaperDocument(
            kind: DocumentKind::Invoice,
            number: $invoice->number,
            issuedOn: $invoice->issued_on,
            dueOn: $invoice->due_on,
            validUntil: null,
            periodStart: $invoice->period_start,
            periodEnd: $invoice->period_end,
            title: $invoice->title,
            description: $invoice->description,
            operationCategory: $isIssued ? ($invoice->operation_category ?? OperationCategory::Services) : $settings->operation_category,
            seller: $seller,
            buyer: $buyer,
            lines: array_values($invoice->lines->map(static fn (InvoiceLine $line): array => [
                'label' => $line->label,
                'detail' => $line->detail,
                'quantityMilli' => $line->quantity_milli,
                'unit' => $line->unit,
                'unitPrice' => $line->unit_price_cents,
                'vatRateBp' => $line->vat_rate_bp,
            ])->all()),
            currency: $invoice->currency,
            term: new PaymentTerm($invoice->payment_terms_days ?? 0, $invoice->payment_terms_end_of_month),
            latePenaltyRateBp: $invoice->late_penalty_rate_bp,
            depositRateBp: null,
            showIban: $invoice->show_iban,
            vatOnDebits: $isIssued ? $invoice->vat_on_debits : ($settings->vat_regime->isLiable() && $settings->vat_on_debits),
            customMentions: $invoice->custom_mentions,
            hasLogo: $user->hasMedia('company_logo'),
        ), new DocumentFormatter($language, $settings->date_format), $isIssued ? null : 'draft');
    }

    /** The sheet of an editor draft that was never saved: the live preview. */
    public function forDraft(User $user, SaveInvoiceDraftData $data): InvoicePaperData
    {
        $settings = $user->settingsOrFail();
        $client = $user->clients()->whereKey($data->clientId)->firstOrFail();
        $vatApplies = $settings->vat_regime->isLiable();
        $issuedOn = $data->issuedOn === null ? $settings->today() : CarbonImmutable::parse($data->issuedOn);
        $term = new PaymentTerm($data->paymentTermsDays, $data->paymentTermsEndOfMonth);
        $lines = [];

        foreach ($data->lines as $line) {
            $lines[] = [
                'label' => $line->label,
                'detail' => $line->detail,
                'quantityMilli' => $line->quantityMilli,
                'unit' => $line->unit,
                'unitPrice' => $line->unitPrice->toMoney(),
                'vatRateBp' => $vatApplies ? $line->vatRateBp : 0,
            ];
        }

        return $this->paperBuilder->build(new PaperDocument(
            kind: DocumentKind::Invoice,
            number: null,
            issuedOn: $issuedOn,
            dueOn: $term->dueOn($issuedOn),
            validUntil: null,
            periodStart: $data->periodStart === null ? null : CarbonImmutable::parse($data->periodStart),
            periodEnd: $data->periodEnd === null ? null : CarbonImmutable::parse($data->periodEnd),
            title: $data->title,
            description: $data->description,
            operationCategory: $settings->operation_category,
            seller: DocumentParties::seller($settings, $data->showIban, $data->showEmail),
            buyer: DocumentParties::buyer($client),
            lines: $lines,
            currency: $settings->currency->value,
            term: $term,
            latePenaltyRateBp: $data->latePenaltyRateBp,
            depositRateBp: null,
            showIban: $data->showIban,
            vatOnDebits: $vatApplies && $settings->vat_on_debits,
            customMentions: $data->customMentions,
            hasLogo: $user->hasMedia('company_logo'),
        ), new DocumentFormatter($data->language, $settings->date_format), 'draft');
    }
}
