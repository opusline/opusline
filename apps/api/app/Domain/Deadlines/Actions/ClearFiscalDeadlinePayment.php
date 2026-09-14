<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Actions;

use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Users\Models\User;

/** Forgets a payment date and nothing else: the return stays filed. Idempotent, like the untick. */
class ClearFiscalDeadlinePayment
{
    public function handle(User $user, FiscalDeadlineKind $kind, string $periodKey): void
    {
        $user->fiscalDeadlineCompletions()
            ->where('kind', $kind)
            ->where('period_key', $periodKey)
            ->update(['paid_on' => null]);
    }
}
