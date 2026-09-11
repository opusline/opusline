<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Bank\Enums\BankMatchStatus;
use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Models\Invoice;

/**
 * Walk an invoice back one stage, for the click that should not have happened.
 *
 * Paid returns to Sent and forgets the payment date; Sent returns to Draft. One
 * stage per call, so undoing a payment never quietly un-sends the invoice too —
 * and the number is kept, because it left the building under that reference
 * whatever happens next.
 *
 * Nothing is erased: the Sent and Paid events stay where they are and a Reopened
 * event is written after them. An invoice's history is a fiscal record, and "it
 * was marked paid on the 4th and that was wrong" is a different statement from
 * "it was never paid".
 */
class ReopenInvoice
{
    public function __construct(
        private readonly LockInvoice $lockInvoice,
        private readonly RecordInvoiceEvent $recordInvoiceEvent,
    ) {}

    public function handle(Invoice $invoice): Invoice
    {
        return $this->lockInvoice->handle($invoice, function (Invoice $locked): Invoice {
            abort_if($locked->status === InvoiceStatus::Draft, 409, __('invoices.cannot_reopen_a_draft'));

            if ($locked->status === InvoiceStatus::Paid) {
                // The money arrived and a movement says so. Undo the match first:
                // clearing the payment under it would leave the two disagreeing,
                // and the statement is the one of the pair that cannot be wrong.
                abort_if(
                    $locked->bankMatches()->where('status', BankMatchStatus::Validated)->exists(),
                    409,
                    __('invoices.payment_settled_in_bank'),
                );

                $locked->update(['status' => InvoiceStatus::Sent, 'paid_on' => null]);
            } else {
                $locked->update(['status' => InvoiceStatus::Draft]);
            }

            $this->recordInvoiceEvent->handle($locked, InvoiceEventKind::Reopened);

            return $locked;
        });
    }
}
