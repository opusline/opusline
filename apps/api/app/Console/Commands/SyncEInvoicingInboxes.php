<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Console\Support\AccountSyncRun;
use App\Domain\EInvoicing\Actions\SyncReceivedEInvoices;
use App\Domain\EInvoicing\Data\EInvoiceSyncData;
use App\Domain\EInvoicing\Models\EInvoicingConnection;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Description('Record the supplier invoices every connected plateforme agréée received')]
#[Signature('einvoicing:sync')]
class SyncEInvoicingInboxes extends Command
{
    public function handle(SyncReceivedEInvoices $syncReceivedEInvoices): int
    {
        $run = new AccountSyncRun('e-invoicing inbox');
        $counts = $run->run(
            EInvoicingConnection::query()->where('company_verified', true)->with('user.settings'),
            fn (EInvoicingConnection $connection): EInvoiceSyncData => $syncReceivedEInvoices->handle($connection->user),
        );

        $this->components->info($run->summary($counts));

        return $run->exitCode($counts);
    }
}
