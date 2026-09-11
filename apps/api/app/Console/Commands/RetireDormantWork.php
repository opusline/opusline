<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Domain\Clients\Actions\RetireDormantWork as RetireDormantWorkAction;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Description('Finish the missions and archive the clients an account has stopped touching')]
#[Signature('clients:retire-dormant')]
class RetireDormantWork extends Command
{
    public function handle(RetireDormantWorkAction $retire): int
    {
        $missions = 0;
        $clients = 0;

        // Only the accounts that asked for it, and one query per account rather
        // than one for the lot: the cutoff is read in the account's own
        // timezone, and an account that has not opted in must cost nothing.
        User::query()
            ->whereHas('settings', fn ($settings) => $settings->whereNotNull('dormant_after_months'))
            ->with('settings')
            ->chunkById(100, function ($users) use ($retire, &$missions, &$clients): void {
                foreach ($users as $user) {
                    $today = CarbonImmutable::now($user->settingsOrFail()->timezone)->startOfDay();
                    $retired = $retire->handle($user, $today);

                    $missions += $retired['missions'];
                    $clients += $retired['clients'];
                }
            });

        $this->info("Finished {$missions} mission(s) and archived {$clients} client(s).");

        return self::SUCCESS;
    }
}
