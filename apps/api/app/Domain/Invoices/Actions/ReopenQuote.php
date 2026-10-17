<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Lifecycle\Quote\QuoteSent;
use App\Domain\Invoices\Models\Quote;

/**
 * « Rouvrir le devis »: a refused or expired quote goes back out, under the
 * same number, with a fresh validity counted from today. An accepted quote
 * is a contract and stays one; a draft was never out.
 */
class ReopenQuote
{
    public function __construct(private readonly LockQuote $lockQuote) {}

    public function handle(Quote $quote): Quote
    {
        return $this->lockQuote->handle($quote, function (Quote $locked): Quote {
            // A draft also goes to Sent, by being issued: reopening is for a quote that already went out.
            abort_unless($locked->status->isIssued() && $locked->lifecycle->canTransitionTo(QuoteSent::class), 409, __('quotes.cannot_reopen'));

            // The move first: its condition reads the validity, which the fresh one would end.
            $locked->lifecycle->transitionTo(QuoteSent::class);
            $locked->update([
                'refused_on' => null,
                'valid_until' => $locked->user->settingsOrFail()->today()->addDays($locked->validity_days),
            ]);

            return $locked;
        });
    }
}
