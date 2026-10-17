<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Enums\QuoteStatus;
use App\Domain\Invoices\Lifecycle\Quote\QuoteAccepted;
use App\Domain\Invoices\Lifecycle\Quote\QuoteRefused;
use App\Domain\Invoices\Models\Quote;
use Carbon\CarbonImmutable;
use Illuminate\Validation\ValidationException;

/** Records the client's answer on a sent quote. */
class DecideQuote
{
    public function __construct(private readonly LockQuote $lockQuote) {}

    public function handle(Quote $quote, QuoteStatus $decision, ?CarbonImmutable $decidedOn): Quote
    {
        assert($decision === QuoteStatus::Accepted || $decision === QuoteStatus::Refused);
        $decided = $decision === QuoteStatus::Accepted ? QuoteAccepted::class : QuoteRefused::class;

        return $this->lockQuote->handle($quote, function (Quote $locked) use ($decision, $decided, $decidedOn): Quote {
            abort_unless($locked->lifecycle->canTransitionTo($decided), 409, __('quotes.cannot_decide'));

            $on = $decidedOn ?? $locked->user->settingsOrFail()->today();

            if ($on->isBefore($locked->issued_on)) {
                throw ValidationException::withMessages(['decidedOn' => __('quotes.decided_on_before_issued')]);
            }

            $locked->fill([
                'accepted_on' => $decision === QuoteStatus::Accepted ? $on : null,
                'refused_on' => $decision === QuoteStatus::Refused ? $on : null,
            ]);
            $locked->lifecycle->transitionTo($decided);

            return $locked;
        });
    }
}
