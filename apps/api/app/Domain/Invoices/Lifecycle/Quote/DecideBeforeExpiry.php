<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Lifecycle\Quote;

use App\Domain\Invoices\Models\Quote;
use Spatie\ModelStates\DefaultTransition;

/** A lapsed offer takes no answer: reopening it is what makes a new one. */
class DecideBeforeExpiry extends DefaultTransition
{
    #[\Override]
    public function canTransition(): bool
    {
        assert($this->model instanceof Quote);

        return ! $this->model->isExpired();
    }
}
