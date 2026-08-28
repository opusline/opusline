<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Actions;

use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Users\Models\User;

/**
 * Undoes a tick. Idempotent on purpose: the answer is the recomputed screen,
 * which says what is owed whether or not a row was there to remove.
 */
class UncompleteFiscalDeadline
{
    public function handle(User $user, FiscalDeadlineKind $kind, string $periodKey): void
    {
        $user->fiscalDeadlineCompletions()
            ->where('kind', $kind)
            ->where('period_key', $periodKey)
            ->delete();
    }
}
