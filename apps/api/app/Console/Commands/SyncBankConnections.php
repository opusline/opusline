<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Domain\Bank\Actions\SyncBankConnection;
use App\Domain\Bank\EnableBanking\BankSyncFailed;
use App\Domain\Bank\Enums\BankConnectionStatus;
use App\Domain\Bank\Models\BankConnection;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Throwable;

#[Description('Read the new movements of every connected bank account')]
#[Signature('bank:sync')]
class SyncBankConnections extends Command
{
    public function handle(SyncBankConnection $syncBankConnection): int
    {
        $synced = 0;
        $refused = 0;
        $crashed = 0;

        BankConnection::query()
            ->where('status', BankConnectionStatus::Active)
            ->whereNotNull('account_uid')
            ->where('valid_until', '>', now())
            ->with('user.settings')
            ->chunkById(50, function (Collection $batch) use ($syncBankConnection, &$synced, &$refused, &$crashed): void {
                foreach ($batch as $connection) {
                    try {
                        $syncBankConnection->handle($connection->user, psu: null);
                        $synced++;
                    } catch (BankSyncFailed $exception) {
                        // A bank out of unattended reads or a revoked consent is
                        // an ordinary night: the connection records why, and the
                        // Compte pro page says so.
                        $refused++;
                        Log::warning('Could not sync a bank connection.', [
                            'user_id' => $connection->user_id,
                            'reason' => $exception->reason->name,
                        ]);
                    } catch (Throwable $exception) {
                        // One account's bug must not stop everyone else's sync.
                        $crashed++;
                        report($exception);
                    }
                }
            });

        $this->components->info("Synced {$synced} bank account(s), {$refused} refused by the bank, {$crashed} failed.");

        return $crashed > 0 ? self::FAILURE : self::SUCCESS;
    }
}
