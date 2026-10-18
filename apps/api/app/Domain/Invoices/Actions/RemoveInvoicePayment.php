<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Bank\Enums\BankMatchStatus;
use App\Domain\Invoices\Enums\CreditNoteSettlement;
use App\Domain\Invoices\Enums\CreditNoteStatus;
use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Lifecycle\Invoice\InvoiceSent;
use App\Domain\Invoices\Models\CreditNote;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Models\InvoicePayment;

/**
 * Takes a payment back off an invoice: a transfer recorded by mistake, or a
 * bank match that was accepted on the wrong invoice. A paid invoice goes back
 * to Sent, and a movement the payment came from is unlinked so it can be
 * matched again.
 */
class RemoveInvoicePayment
{
    public function __construct(
        private readonly LockInvoice $lockInvoice,
        private readonly RecordInvoiceEvent $recordInvoiceEvent,
    ) {}

    public function handle(Invoice $invoice, InvoicePayment $payment): Invoice
    {
        return $this->lockInvoice->handle($invoice, function (Invoice $locked) use ($payment): Invoice {
            abort_unless($payment->invoice_id === $locked->id, 404);
            // A deduction moved money between two invoices at once: one side alone cannot go.
            abort_if(
                $payment->credit_note_id !== null && CreditNote::query()->whereKey($payment->credit_note_id)->value('settlement') === CreditNoteSettlement::DeductFromNextInvoice,
                409,
                __('credit_notes.deduction_payment_fixed'),
            );

            $this->unlinkMovement($locked, $payment);
            $this->reopenCreditNote($payment);
            $payment->delete();

            // A refund taken back leaves the client owed again, the invoice still paid.
            if ($locked->status === InvoiceStatus::Paid && $locked->balanceDue()->isPositive()) {
                $locked->lifecycle->transitionTo(InvoiceSent::class);
                $locked->events()->where('kind', InvoiceEventKind::Paid)->delete();
            }

            // Money that was declared in a period is no longer there: history.
            $this->recordInvoiceEvent->handle($locked, InvoiceEventKind::Updated);

            return $locked;
        });
    }

    /** A refund taken back means the money is owed to the client again. */
    private function reopenCreditNote(InvoicePayment $payment): void
    {
        if ($payment->credit_note_id === null) {
            return;
        }

        CreditNote::query()->whereKey($payment->credit_note_id)->update([
            'status' => CreditNoteStatus::Issued,
            'settled_on' => null,
        ]);
    }

    /** The match that paid it is dismissed rather than deleted: its row says the pair was looked at. */
    private function unlinkMovement(Invoice $invoice, InvoicePayment $payment): void
    {
        if ($payment->bank_movement_id === null) {
            return;
        }

        $invoice->user->bankMovements()->whereKey($payment->bank_movement_id)->update(['invoice_id' => null]);
        $invoice->user->bankMatches()
            ->where('bank_movement_id', $payment->bank_movement_id)
            ->where('invoice_id', $invoice->id)
            ->update(['status' => BankMatchStatus::Dismissed]);
    }
}
