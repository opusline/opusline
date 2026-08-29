<?php

declare(strict_types=1);

namespace App\Domain\Settings\Jobs;

use App\Domain\Settings\Actions\RefreshOfficialRates;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Settings\Rates\RatesUnavailable;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Contracts\Queue\ShouldQueueAfterCommit;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

/**
 * The barème read a settings save schedules instead of blocking on: the
 * upstream call carries a 10-second timeout, and paying it inside
 * PUT /api/settings pinned an Octane worker for the duration. The save
 * answers with the stored rates and a ratesRefreshing flag; this catches the
 * account up moments later. « Vérifier maintenant » stays synchronous — there
 * the user asked for the check and is watching.
 */
class RefreshOfficialRatesJob implements ShouldQueue, ShouldQueueAfterCommit
{
    use Queueable;

    public int $tries = 3;

    public int $backoff = 10;

    public bool $deleteWhenMissingModels = true;

    public readonly CarbonImmutable $dispatchedAt;

    public function __construct(public UserSettings $settings)
    {
        $this->dispatchedAt = CarbonImmutable::now();
    }

    public function handle(RefreshOfficialRates $refreshOfficialRates): void
    {
        // Re-read the flags at run time: the account may have left France or
        // gone manual between the save and this job.
        if (! $this->settings->hasFrenchFiscality() || ! $this->settings->auto_rates) {
            return;
        }

        try {
            $refreshOfficialRates->handle($this->settings);
        } catch (RatesUnavailable $exception) {
            // Caught rather than rethrown for the queue's retries: the client
            // already retried what was transient, the 15-minute unavailable
            // marker would answer immediate retries anyway, and on the sync
            // queue a rethrow would fail the very save this job exists to
            // unblock. $tries covers genuine job failures (a deadlock), not
            // an unreachable barème.
            $this->markBaremeUnread($exception);
        }
    }

    /**
     * The stored rates stay; the cleared check date is what tells the settings
     * screen the barème could not be re-read. Skipped when a newer check — a
     * « Vérifier maintenant », the nightly run — already stamped the row while
     * this job was waiting on the timeout: its verdict is fresher than ours.
     */
    private function markBaremeUnread(RatesUnavailable $exception): void
    {
        // Re-read: the model was hydrated before the slow upstream call, and
        // the newer check would have landed during it.
        $checkedAt = $this->settings->refresh()->rates_checked_at;

        if (! $checkedAt instanceof CarbonImmutable || $checkedAt->lessThan($this->dispatchedAt)) {
            $this->settings->update(['rates_checked_at' => null, 'rates_year' => null]);
        }

        Log::warning('Settings saved without re-reading the barème.', [
            'user_id' => $this->settings->user_id,
            'reason' => $exception->getMessage(),
        ]);
    }
}
