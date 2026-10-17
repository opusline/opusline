<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Lifecycle\Quote;

use App\Domain\Invoices\Models\Quote;
use Spatie\ModelStates\DefaultTransition;

/** Sent onto Sent is only a move once the validity has run out. */
class ReopenAfterExpiry extends DefaultTransition
{
    #[\Override]
    public function canTransition(): bool
    {
        assert($this->model instanceof Quote);

        return $this->model->isExpired();
    }
}
