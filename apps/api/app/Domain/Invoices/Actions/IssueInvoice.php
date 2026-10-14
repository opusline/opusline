<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Documents\DocumentParties;
use App\Domain\Invoices\Documents\PaymentTerm;
use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Users\Models\User;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Validation\ValidationException;

/**
 * Validates an Opusline draft into an issued invoice.
 *
 * French rules: the number is the next of one continuous, chronological
 * series, so it is assigned now, dated today, under the user-row lock; and
 * from here the invoice is frozen — its parties copied as they stand, its
 * lines and totals no longer editable, the document undeletable. Corrections
 * go through a credit note.
 */
class IssueInvoice
{
    public function __construct(
        private readonly LockInvoice $lockInvoice,
        private readonly SuggestInvoiceNumber $suggestInvoiceNumber,
        private readonly RecordInvoiceEvent $recordInvoiceEvent,
    ) {}

    public function handle(User $user, Invoice $invoice): Invoice
    {
        abort_if(
            ! $invoice->isWrittenInOpusline() || $invoice->status !== InvoiceStatus::Draft,
            409,
            __('invoices.not_an_opusline_draft'),
        );

        return $this->lockInvoice->handle($invoice, function (Invoice $locked) use ($user): Invoice {
            $settings = $user->settingsOrFail();
            $locked->load(['client', 'lines']);
            $this->assertIssuable($locked, $settings);

            $issuedOn = $settings->today();
            $term = new PaymentTerm($locked->payment_terms_days ?? 0, $locked->payment_terms_end_of_month);

            try {
                $locked->update([
                    // The series continues from whatever the account last numbered,
                    // in Opusline or before it: one business, one sequence.
                    'number' => $this->suggestInvoiceNumber->handle($user)->number,
                    'status' => InvoiceStatus::Sent,
                    'issued_on' => $issuedOn,
                    'due_on' => $term->dueOn($issuedOn),
                    'seller_snapshot' => DocumentParties::seller($settings, $locked),
                    'buyer_snapshot' => DocumentParties::buyer($locked->client),
                ]);
            } catch (UniqueConstraintViolationException) {
                throw ValidationException::withMessages([
                    'number' => __('invoices.number_taken'),
                ]);
            }

            $this->recordInvoiceEvent->handle($locked, InvoiceEventKind::Sent, $issuedOn);

            return $locked;
        });
    }

    /** What a French invoice cannot go out without (art. 242 nonies A CGI). */
    private function assertIssuable(Invoice $invoice, UserSettings $settings): void
    {
        $errors = [];

        if ($invoice->lines->isEmpty()) {
            $errors['lines'] = __('invoices.issue_needs_lines');
        } elseif (! $invoice->amount_ht_cents->isPositive()) {
            $errors['lines'] = __('invoices.issue_needs_positive_total');
        }

        if (blank($settings->trade_name) || blank($settings->company_address_line1) || blank($settings->company_city)
            || ($settings->hasFrenchFiscality() && blank($settings->siret))) {
            $errors['seller'] = __('invoices.issue_needs_seller_identity');
        }

        if (blank($invoice->client->billing_address_line1) || blank($invoice->client->billing_city)) {
            $errors['buyer'] = __('invoices.issue_needs_buyer_address');
        }

        if ($invoice->show_iban && blank($settings->iban)) {
            $errors['showIban'] = __('invoices.issue_needs_iban');
        }

        if ($errors !== []) {
            throw ValidationException::withMessages($errors);
        }
    }
}
