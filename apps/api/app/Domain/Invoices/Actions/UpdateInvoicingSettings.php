<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\UpdateInvoicingSettingsData;
use App\Domain\Settings\Models\UserSettings;

class UpdateInvoicingSettings
{
    public function handle(UserSettings $settings, UpdateInvoicingSettingsData $data): void
    {
        $settings->update([
            'invoicing_mode' => $data->mode,
            'default_payment_terms_days' => $data->defaultPaymentTermsDays,
            'default_payment_terms_end_of_month' => $data->defaultPaymentTermsEndOfMonth,
            'quote_validity_days' => $data->quoteValidityDays,
            'late_penalty_rate_bp' => $data->latePenaltyRateBp,
            'operation_category' => $data->operationCategory,
            'show_iban_on_invoices' => $data->showIbanOnInvoices,
            'show_email_on_documents' => $data->showEmailOnDocuments,
            // The option for VAT on debits only exists for a VAT-liable
            // account; under the franchise it would print a false mention.
            'vat_on_debits' => $settings->vat_regime->isLiable() && $data->vatOnDebits,
            'custom_mentions' => blank($data->customMentions) ? null : trim($data->customMentions),
            'document_language' => $data->documentLanguage,
        ]);
    }
}
