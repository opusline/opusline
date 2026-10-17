<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Enums\CreditNoteStatus;
use App\Domain\Invoices\Models\CreditNote;
use App\Domain\Invoices\Models\Invoice;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Illuminate\Validation\ValidationException;

/**
 * Settles the credit notes an invoice deducts, the day it is issued: what each
 * owes back leaves its own invoice as a negative payment and lands on this one
 * as a payment, so the client pays this invoice net of it. Cash basis: the two
 * cancel out that day, and only the money the client then pays is collected.
 */
class DeductCreditNotes
{
    /** Refuses before anything is numbered when the credit notes exceed the invoice. */
    public function assertFits(Invoice $invoice): void
    {
        $invoice->loadMissing('deductedCreditNotes.invoice');
        $owed = $invoice->deductedCreditNotes->reduce(
            static fn (Money $sum, CreditNote $creditNote): Money => $sum->add($creditNote->owedBack()),
            new Money(0, $invoice->currency),
        );

        if ($owed->greaterThan($invoice->amount_ttc_cents)) {
            throw ValidationException::withMessages(['creditNoteIds' => __('credit_notes.deduction_exceeds_invoice')]);
        }
    }

    public function handle(Invoice $invoice, CarbonImmutable $issuedOn): void
    {
        $invoice->loadMissing('deductedCreditNotes.invoice');

        foreach ($invoice->deductedCreditNotes as $creditNote) {
            $owed = $creditNote->owedBack();

            if ($owed->isPositive()) {
                $creditNote->invoice->payments()->create([
                    'user_id' => $invoice->user_id,
                    'currency' => $invoice->currency,
                    'amount_cents' => $owed->negative(),
                    'paid_on' => $issuedOn,
                    'credit_note_id' => $creditNote->id,
                ]);
                $invoice->payments()->create([
                    'user_id' => $invoice->user_id,
                    'currency' => $invoice->currency,
                    'amount_cents' => $owed,
                    'paid_on' => $issuedOn,
                    'credit_note_id' => $creditNote->id,
                ]);
            }

            $creditNote->update(['status' => CreditNoteStatus::Settled, 'settled_on' => $issuedOn]);
        }
    }
}
