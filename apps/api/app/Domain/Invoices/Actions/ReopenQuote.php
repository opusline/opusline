<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Enums\QuoteStatus;
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
            abort_if($locked->status !== QuoteStatus::Refused && ! $locked->isExpired(), 409, __('quotes.cannot_reopen'));

            $locked->update([
                'status' => QuoteStatus::Sent,
                'refused_on' => null,
                'valid_until' => $locked->user->settingsOrFail()->today()->addDays($locked->validity_days),
            ]);

            return $locked;
        });
    }
}
