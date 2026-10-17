<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Enums\BankMatchStatus;
use App\Domain\Bank\Models\BankMatch;
use App\Domain\Invoices\Actions\PayInvoice;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Accepts a suggestion: the movement's amount is recorded as a payment on the
 * invoice, dated its booking day — through PayInvoice, the only door to a
 * payment, whose 409s (already paid, paid before issue, more than is due)
 * surface untouched — and the movement is linked to the invoice.
 *
 * Taking the payment back off the invoice is what undoes it: see
 * RemoveInvoicePayment, which unlinks the movement and dismisses the match.
 */
class ValidateBankMatch
{
    public function __construct(
        private readonly PayInvoice $payInvoice,
    ) {}

    public function handle(BankMatch $match): BankMatch
    {
        return DB::transaction(function () use ($match): BankMatch {
            $user = User::lockRow($match->user_id);

            $match->refresh();

            abort_if($match->status !== BankMatchStatus::Pending, 409, __('bank.match_already_settled'));

            // Nothing at the storage layer ties a match's invoice to its own
            // user_id, so the account is what resolves both rows.
            $movement = $user->bankMovements()->whereKey($match->bank_movement_id)->sole();
            $invoice = $user->invoices()->whereKey($match->invoice_id)->sole();

            // No request validated this date, so the not-in-the-future rule
            // runs here: a statement with a future booking date must not book
            // revenue into an unopened period.
            abort_if(
                $movement->booked_on->greaterThan($user->settingsOrFail()->today()),
                409,
                __('bank.movement_in_future'),
            );

            $this->payInvoice->handle($invoice, $movement->booked_on, $movement->amount_cents, $movement);

            $movement->update(['invoice_id' => $invoice->id]);
            $match->update(['status' => BankMatchStatus::Validated]);

            return $match;
        });
    }
}
