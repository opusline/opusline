<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Enums\CreditNoteSettlement;
use App\Domain\Invoices\Enums\CreditNoteStatus;
use App\Domain\Invoices\Models\CreditNote;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Validation\ValidationException;

/**
 * « Marquer le remboursement effectué »: the money a credit note owes the
 * client went back by transfer. It is recorded as a negative payment of the
 * invoice, dated the day it left — the day URSSAF and the TVA take it off —
 * and the credit note is settled.
 */
class RefundCreditNote
{
    public function __construct(private readonly LockInvoice $lockInvoice) {}

    /**
     * @throws ValidationException
     */
    public function handle(User $user, CreditNote $creditNote, CarbonImmutable $refundedOn, ?int $bankMovementId = null): CreditNote
    {
        return $this->lockInvoice->handle($creditNote->invoice, function (Invoice $locked) use ($user, $creditNote, $refundedOn, $bankMovementId): CreditNote {
            $creditNote->refresh();

            abort_unless(
                $creditNote->status === CreditNoteStatus::Issued && $creditNote->settlement === CreditNoteSettlement::Refund,
                409,
                __('credit_notes.not_to_refund'),
            );
            abort_if($refundedOn->isBefore($creditNote->issued_on), 409, __('credit_notes.refund_before_issue'));

            // What goes back is what the client overpaid, which the credit note may exceed
            // when part of the invoice was still unpaid.
            $owed = $locked->balanceDue()->absolute();
            abort_unless($locked->balanceDue()->isNegative(), 409, __('credit_notes.not_to_refund'));

            $movement = null;

            if ($bankMovementId !== null) {
                $movement = $user->bankMovements()->whereKey($bankMovementId)->first();

                if ($movement === null || ! $movement->amount_cents->isNegative() || $movement->invoice_id !== null || $movement->expense_id !== null) {
                    throw ValidationException::withMessages(['bankMovementId' => __('credit_notes.movement_not_a_free_debit')]);
                }

                if (! $movement->amount_cents->absolute()->equals($owed)) {
                    throw ValidationException::withMessages(['bankMovementId' => __('credit_notes.movement_amount_mismatch')]);
                }
            }

            // A matched debit dates the refund itself: the money left that day.
            $leftOn = $movement === null ? $refundedOn : $movement->booked_on;

            $locked->payments()->create([
                'user_id' => $locked->user_id,
                'currency' => $locked->currency,
                'amount_cents' => $owed->negative(),
                'paid_on' => $leftOn,
                'bank_movement_id' => $movement?->id,
                'credit_note_id' => $creditNote->id,
            ]);

            $movement?->update(['invoice_id' => $locked->id]);

            $creditNote->update([
                'status' => CreditNoteStatus::Settled,
                'settled_on' => $leftOn,
            ]);

            return $creditNote;
        });
    }
}
