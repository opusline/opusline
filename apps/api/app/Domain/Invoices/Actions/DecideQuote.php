<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Enums\QuoteStatus;
use App\Domain\Invoices\Models\Quote;
use Carbon\CarbonImmutable;
use Illuminate\Validation\ValidationException;

/**
 * Records the client's answer on a sent quote. An expired quote takes no
 * answer: its offer lapsed, and reopening it is what makes a new one.
 */
class DecideQuote
{
    public function __construct(private readonly LockQuote $lockQuote) {}

    public function handle(Quote $quote, QuoteStatus $decision, ?CarbonImmutable $decidedOn): Quote
    {
        assert($decision === QuoteStatus::Accepted || $decision === QuoteStatus::Refused);

        return $this->lockQuote->handle($quote, function (Quote $locked) use ($decision, $decidedOn): Quote {
            abort_if($locked->status !== QuoteStatus::Sent, 409, __('quotes.cannot_decide_unless_sent'));
            abort_if($locked->isExpired(), 409, __('quotes.expired'));

            $on = $decidedOn ?? $locked->user->settingsOrFail()->today();

            if ($on->isBefore($locked->issued_on)) {
                throw ValidationException::withMessages(['decidedOn' => __('quotes.decided_on_before_issued')]);
            }

            $locked->update([
                'status' => $decision,
                'accepted_on' => $decision === QuoteStatus::Accepted ? $on : null,
                'refused_on' => $decision === QuoteStatus::Refused ? $on : null,
            ]);

            return $locked;
        });
    }
}
