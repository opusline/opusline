<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\InvoiceLineInputData;
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
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Enums\QuoteBilling;
use App\Domain\Invoices\Models\CreditNote;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Models\InvoiceLine;
use App\Domain\Invoices\Models\InvoicePayment;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;

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
        $invoice->loadMissing(['client', 'lines', 'user.settings', 'user.media', 'quote.invoices']);
        $user = $invoice->user;
        $settings = $user->settingsOrFail();
        $isIssued = $invoice->status->isIssued();
        $format = new DocumentFormatter($language, $settings->date_format);

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
            lines: array_values($invoice->lines->map(static fn (InvoiceLine $line): array => $line->toPaperLine())->all()),
            currency: $invoice->currency,
            term: new PaymentTerm($invoice->payment_terms_days ?? 0, $invoice->payment_terms_end_of_month),
            latePenaltyRateBp: $invoice->late_penalty_rate_bp,
            depositRateBp: null,
            showIban: $invoice->show_iban,
            vatOnDebits: $isIssued ? $invoice->vat_on_debits : ($settings->vat_regime->isLiable() && $settings->vat_on_debits),
            customMentions: $invoice->custom_mentions,
            hasLogo: $user->hasMedia('company_logo'),
            quoteMention: $this->quoteMention($invoice, $format),
            deductions: $this->deductions($invoice),
        ), $format, $isIssued ? null : 'draft');
    }

    /**
     * What it deducts: on an issued invoice, the amounts it settled; on a
     * draft, what each claimed credit note still owes back.
     *
     * @return list<array{number: string, amount: Money}>
     */
    private function deductions(Invoice $invoice): array
    {
        $invoice->loadMissing(['deductedCreditNotes.invoice' => static fn ($deducted) => $deducted->withPaymentFigures(), 'payments']);

        return array_values($invoice->deductedCreditNotes->map(static function (CreditNote $creditNote) use ($invoice): array {
            $settled = $invoice->payments->firstWhere('credit_note_id', $creditNote->id);

            return [
                'number' => $creditNote->number,
                'amount' => $settled instanceof InvoicePayment ? $settled->amount_cents : $creditNote->owedBack(),
            ];
        })->all());
    }

    /** « Établie au titre du devis n° … », and for a balance the deposits it deducts. */
    private function quoteMention(Invoice $invoice, DocumentFormatter $format): ?string
    {
        $quote = $invoice->quote;

        if ($quote === null || $invoice->quote_billing === null) {
            return null;
        }

        $number = (string) $quote->number;
        $sentences = [match ($invoice->quote_billing) {
            QuoteBilling::Deposit => $this->text($format, 'legal.deposit_invoice', ['rate' => rtrim($format->rate((int) $quote->deposit_rate_bp), ' %'), 'number' => $number]),
            default => $this->text($format, 'legal.from_quote', ['number' => $number]),
        }];

        if ($invoice->quote_billing === QuoteBilling::Balance) {
            $deducted = $quote->invoices
                ->filter(static fn (Invoice $other): bool => $other->quote_billing === QuoteBilling::Deposit && $other->status->isIssued() && $other->status !== InvoiceStatus::Cancelled)
                ->map(fn (Invoice $other): string => $this->text($format, 'legal.deducted_deposit', [
                    'number' => (string) $other->number,
                    'date' => $format->date($other->issued_on),
                    'amount' => $format->money($other->creditableAmount()),
                ]));

            if ($deducted->isNotEmpty()) {
                $sentences[] = $this->text($format, 'legal.deposits_deducted', ['list' => $deducted->implode(', ')]);
            }
        }

        return implode(' ', $sentences);
    }

    /**
     * @param  array<string, string>  $replace
     */
    private function text(DocumentFormatter $format, string $key, array $replace = []): string
    {
        return (string) __("invoice_document.{$key}", $replace, $format->locale());
    }

    /** The sheet of an editor draft that was never saved: the live preview. */
    public function forDraft(User $user, SaveInvoiceDraftData $data): InvoicePaperData
    {
        $settings = $user->settingsOrFail();
        $client = $user->clients()->whereKey($data->clientId)->firstOrFail();
        $vatApplies = $settings->vat_regime->isLiable();
        $issuedOn = $data->issuedOn === null ? $settings->today() : CarbonImmutable::parse($data->issuedOn);
        $term = new PaymentTerm($data->paymentTermsDays, $data->paymentTermsEndOfMonth);
        $lines = array_map(static fn (InvoiceLineInputData $line): array => $line->toPaperLine($vatApplies), $data->lines);

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
            deductions: array_values($user->creditNotes()
                ->whereKey($data->creditNoteIds)
                ->where('client_id', $client->id)
                ->with(['invoice' => static fn ($invoice) => $invoice->withPaymentFigures()])
                ->get()
                ->map(static fn (CreditNote $creditNote): array => ['number' => $creditNote->number, 'amount' => $creditNote->owedBack()])
                ->all()),
        ), new DocumentFormatter($data->language, $settings->date_format), 'draft');
    }
}
