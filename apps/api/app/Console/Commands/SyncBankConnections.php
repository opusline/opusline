<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Console\Support\AccountSyncRun;
use App\Domain\Bank\Actions\SyncBankConnection;
use App\Domain\Bank\Enums\BankConnectionStatus;
use App\Domain\Bank\Models\BankConnection;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Description('Read the new movements of every connected bank account')]
#[Signature('bank:sync')]
class SyncBankConnections extends Command
{
    public function handle(SyncBankConnection $syncBankConnection): int
    {
        $run = new AccountSyncRun('bank account');
        $counts = $run->run(
            BankConnection::query()
                ->where('status', BankConnectionStatus::Active)
                ->whereNotNull('account_uid')
                ->whereNotNull('bank_account_id')
                ->where('valid_until', '>', now())
                ->with(['user.settings', 'statement']),
            // No holder at the keyboard: the bank must count it as a background read.
            fn (BankConnection $connection): array => $syncBankConnection->handle($connection, psu: null),
        );

        $this->components->info($run->summary($counts));

        return $run->exitCode($counts);
    }
}
