<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Enums\BankMatchStatus;
use App\Domain\Bank\Models\BankMatch;
use App\Domain\Invoices\Actions\PayInvoice;
use App\Domain\Invoices\Data\PayInvoiceData;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Accepts a suggestion: the invoice is paid on the movement's booked date —
 * through PayInvoice, the only door to Paid, whose 409s (already paid, paid
 * before issue) surface untouched — and the movement is linked to it.
 *
 * No un-validate exists: if the invoice is later edited off Paid, the match
 * stays Validated and the movement stays linked.
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

            $movement = $match->movement;

            // PayInvoiceData is built here, not from a request, so the
            // not-in-the-future rule never ran — a statement with a future
            // booking date must not book revenue into an unopened period.
            abort_if(
                $movement->booked_on->greaterThan($user->settingsOrFail()->today()),
                409,
                __('bank.movement_in_future'),
            );

            $this->payInvoice->handle(
                $match->invoice,
                PayInvoiceData::from(['paidOn' => $movement->booked_on->toDateString()]),
            );

            $movement->update(['invoice_id' => $match->invoice_id]);
            $match->update(['status' => BankMatchStatus::Validated]);

            return $match;
        });
    }
}
