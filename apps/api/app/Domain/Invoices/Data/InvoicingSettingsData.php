<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Enums\InvoicingMode;
use App\Domain\Invoices\Enums\OperationCategory;
use App\Domain\Invoices\LatePayment\LegalReference;
use App\Domain\Settings\Models\UserSettings;
use Spatie\LaravelData\Data;

/** The defaults every new invoice and quote starts from. A document already issued never changes with them. */
class InvoicingSettingsData extends Data
{
    public function __construct(
        public InvoicingMode $mode,
        public int $defaultPaymentTermsDays,
        /** Counted from the last day of the issue month rather than from the issue date. */
        public bool $defaultPaymentTermsEndOfMonth,
        public int $quoteValidityDays,
        /** Null states no rate on the invoice, so the statutory one applies. */
        public ?int $latePenaltyRateBp,
        public OperationCategory $operationCategory,
        public bool $showIbanOnInvoices,
        public bool $showEmailOnDocuments,
        /** Only ever true for an account liable for VAT: a stored choice is hidden once the account leaves liability. */
        public bool $vatOnDebits,
        public ?string $customMentions,
        public DocumentLanguage $documentLanguage,
        /** Whether the VAT-on-debits option applies to this account at all. */
        public bool $vatLiable,
        public LegalReferenceData $legalReference,
        /** What the next invoice validated today will be numbered: the series continues from the last number. */
        public string $nextInvoiceNumber,
        /** The quotes' own series, with the same tokens as the invoices' (AAAA, MM, NNN). */
        public string $quoteNumberFormat,
        public string $nextQuoteNumber,
        /** The credit notes' own series (AAAA, MM, NNN), continuous like the others. */
        public string $creditNoteNumberFormat,
        public string $nextCreditNoteNumber,
    ) {}

    public static function fromSettings(UserSettings $settings, string $nextInvoiceNumber, string $nextQuoteNumber, string $nextCreditNoteNumber): self
    {
        return new self(
            mode: $settings->invoicing_mode,
            defaultPaymentTermsDays: $settings->default_payment_terms_days,
            defaultPaymentTermsEndOfMonth: $settings->default_payment_terms_end_of_month,
            quoteValidityDays: $settings->quote_validity_days,
            latePenaltyRateBp: $settings->late_penalty_rate_bp,
            operationCategory: $settings->operation_category,
            showIbanOnInvoices: $settings->show_iban_on_invoices,
            showEmailOnDocuments: $settings->show_email_on_documents,
            vatOnDebits: $settings->vat_regime->isLiable() && $settings->vat_on_debits,
            customMentions: $settings->custom_mentions,
            documentLanguage: $settings->document_language,
            vatLiable: $settings->vat_regime->isLiable(),
            legalReference: LegalReferenceData::fromReference(LegalReference::current()),
            nextInvoiceNumber: $nextInvoiceNumber,
            quoteNumberFormat: $settings->quote_number_format,
            nextQuoteNumber: $nextQuoteNumber,
            creditNoteNumberFormat: $settings->credit_note_number_format,
            nextCreditNoteNumber: $nextCreditNoteNumber,
        );
    }
}
