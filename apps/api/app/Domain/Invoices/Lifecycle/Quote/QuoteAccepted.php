<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Lifecycle\Quote;

use App\Domain\Invoices\Enums\QuoteStatus;

class QuoteAccepted extends QuoteLifecycle
{
    #[\Override]
    public static function status(): QuoteStatus
    {
        return QuoteStatus::Accepted;
    }
}
