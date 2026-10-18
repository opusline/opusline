<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Documents\Actions\StoreGeneratedDocument;
use App\Domain\Documents\Enums\DocumentCategory;
use App\Domain\Invoices\Documents\DocumentParties;
use App\Domain\Invoices\Documents\IssueReadiness;
use App\Domain\Invoices\Documents\PaymentTerm;
use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Invoices\Lifecycle\Invoice\InvoicePaid;
use App\Domain\Invoices\Lifecycle\Invoice\InvoiceSent;
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
        private readonly RenderInvoicePdf $renderInvoicePdf,
        private readonly StoreGeneratedDocument $storeGeneratedDocument,
        private readonly DeductCreditNotes $deductCreditNotes,
    ) {}

    public function handle(User $user, Invoice $invoice): Invoice
    {
        return $this->lockInvoice->handle($invoice, function (Invoice $locked) use ($user): Invoice {
            // Judged on the refreshed row, under the lock: two requests racing
            // on the same draft would otherwise both pass and number it twice.
            abort_unless(
                $locked->isWrittenInOpusline() && $locked->lifecycle->canTransitionTo(InvoiceSent::class),
                409,
                __('invoices.not_an_opusline_draft'),
            );

            $settings = $user->settingsOrFail();
            $locked->load(['client', 'lines']);
            $this->assertIssuable($locked, $settings);
            $this->deductCreditNotes->assertFits($locked);

            $issuedOn = $settings->today();
            $term = new PaymentTerm($locked->payment_terms_days ?? 0, $locked->payment_terms_end_of_month);

            try {
                $locked->fill([
                    // The series continues from whatever the account last numbered,
                    // in Opusline or before it: one business, one sequence.
                    'number' => $this->suggestInvoiceNumber->handle($user)->number,
                    'issued_on' => $issuedOn,
                    'due_on' => $term->dueOn($issuedOn),
                    'seller_snapshot' => DocumentParties::seller($settings, $locked->show_iban, $locked->show_email),
                    'operation_category' => $settings->operation_category,
                    'vat_on_debits' => $settings->vat_regime->isLiable() && $settings->vat_on_debits,
                    'buyer_snapshot' => DocumentParties::buyer($locked->client),
                ]);
                $locked->lifecycle->transitionTo(InvoiceSent::class);
            } catch (UniqueConstraintViolationException) {
                throw ValidationException::withMessages([
                    'number' => __('invoices.number_taken'),
                ]);
            }

            $this->recordInvoiceEvent->handle($locked, InvoiceEventKind::Sent, $issuedOn);
            $this->deductCreditNotes->handle($locked, $issuedOn);

            // Credit notes that cover it whole leave nothing to pay.
            if (! $locked->balanceDue()->isPositive()) {
                $locked->lifecycle->transitionTo(InvoicePaid::class);
                $this->recordInvoiceEvent->handle($locked, InvoiceEventKind::Paid, $issuedOn);
            }

            // The legal copy: filed with the client's documents, in the language
            // the invoice was written in, inside the same transaction as its number.
            $language = $locked->language ?? DocumentLanguage::French;
            $this->storeGeneratedDocument->handle(
                $locked->client,
                $this->renderInvoicePdf->handle($locked, $language),
                $this->renderInvoicePdf->fileName($locked, $language),
                DocumentCategory::IssuedInvoice,
                $locked->documentProperties(),
            );

            return $locked;
        });
    }

    /** What a French invoice cannot go out without (art. 242 nonies A CGI). */
    private function assertIssuable(Invoice $invoice, UserSettings $settings): void
    {
        $errors = array_map(
            static fn (string $problem): string => __("invoices.issue_{$problem}"),
            IssueReadiness::problems($settings, $invoice->client, $invoice->lines, $invoice->amount_ht_cents),
        );

        if ($invoice->show_iban && blank($settings->iban)) {
            $errors['showIban'] = __('invoices.issue_needs_iban');
        }

        if ($errors !== []) {
            throw ValidationException::withMessages($errors);
        }
    }
}
