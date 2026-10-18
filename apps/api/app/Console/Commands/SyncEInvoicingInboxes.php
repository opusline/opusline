<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Console\Support\AccountSyncRun;
use App\Domain\EInvoicing\Actions\SyncReceivedEInvoices;
use App\Domain\EInvoicing\Data\EInvoiceSyncData;
use App\Domain\EInvoicing\Models\EInvoicingConnection;
use App\Domain\Features\Enums\FeatureFlag;
use App\Domain\Features\FeatureFlags;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Description('Record the supplier invoices every connected plateforme agréée received')]
#[Signature('einvoicing:sync')]
class SyncEInvoicingInboxes extends Command
{
    public function handle(SyncReceivedEInvoices $syncReceivedEInvoices, FeatureFlags $featureFlags): int
    {
        // An account without invoicing sees no inbox: nothing should land in it.
        $activeConnectionIds = EInvoicingConnection::query()
            ->where('company_verified', true)
            ->with('user')
            ->get()
            ->filter(static fn (EInvoicingConnection $connection): bool => $featureFlags->isActive($connection->user, FeatureFlag::Invoicing))
            ->modelKeys();

        $run = new AccountSyncRun('e-invoicing inbox');
        $counts = $run->run(
            EInvoicingConnection::query()->whereKey($activeConnectionIds)->with('user.settings'),
            fn (EInvoicingConnection $connection): EInvoiceSyncData => $syncReceivedEInvoices->handle($connection->user),
        );

        $this->components->info($run->summary($counts));

        return $run->exitCode($counts);
    }
}
