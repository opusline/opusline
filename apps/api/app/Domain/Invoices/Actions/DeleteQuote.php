<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Models\Quote;

/** Only a draft goes: a numbered quote is part of a gap-free series. */
class DeleteQuote
{
    public function __construct(private readonly LockQuote $lockQuote) {}

    public function handle(Quote $quote): void
    {
        $this->lockQuote->handle($quote, function (Quote $locked): void {
            abort_if($locked->status->isIssued(), 409, __('quotes.cannot_delete_issued'));

            $locked->delete();
        });
    }
}
