<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Actions;

use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Deadlines\Models\FiscalDeadlineCompletion;
use App\Domain\Users\Models\User;

/**
 * Dates the payment of a return already marked as filed — paying what was
 * never declared is not a state the fisc knows, so the tick has to exist.
 */
class RecordFiscalDeadlinePayment
{
    public function handle(User $user, FiscalDeadlineKind $kind, string $periodKey): void
    {
        $completion = $user->fiscalDeadlineCompletions()
            ->where('kind', $kind)
            ->where('period_key', $periodKey)
            ->first();

        abort_if(! $completion instanceof FiscalDeadlineCompletion, 409, __('deadlines.not_completed'));

        $completion->update(['paid_on' => $user->settingsOrFail()->today()]);
    }
}
