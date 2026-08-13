<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Domain\Settings\Actions\RefreshOfficialRates as RefreshOfficialRatesAction;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Settings\Rates\RatesUnavailable;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

#[Description('Read the official URSSAF barème and apply it to every account following it')]
#[Signature('rates:refresh')]
class RefreshOfficialRates extends Command
{
    public function handle(RefreshOfficialRatesAction $refreshOfficialRates): int
    {
        $refreshed = 0;
        $failed = 0;

        UserSettings::query()
            ->where('auto_rates', true)
            ->chunkById(100, function (Collection $batch) use ($refreshOfficialRates, &$refreshed, &$failed): void {
                foreach ($batch as $settings) {
                    try {
                        $refreshOfficialRates->handle($settings);
                        $refreshed++;
                    } catch (RatesUnavailable $exception) {
                        // One unreachable account must not abort the run, and its
                        // stored rates stay as they were.
                        $failed++;
                        Log::warning('Could not refresh official rates.', [
                            'user_id' => $settings->user_id,
                            'reason' => $exception->getMessage(),
                        ]);
                    }
                }
            });

        $this->components->info("Refreshed {$refreshed} account(s), {$failed} failed.");

        return $failed > 0 ? self::FAILURE : self::SUCCESS;
    }
}
