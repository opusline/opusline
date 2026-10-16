<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Domain\EInvoicing\Actions\SyncReceivedEInvoices;
use App\Domain\EInvoicing\Models\EInvoicingConnection;
use App\Domain\EInvoicing\Platform\EInvoicingPlatformException;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Throwable;

#[Description('Record the supplier invoices every connected plateforme agréée received')]
#[Signature('einvoicing:sync')]
class SyncEInvoicingInboxes extends Command
{
    public function handle(SyncReceivedEInvoices $syncReceivedEInvoices): int
    {
        $synced = 0;
        $refused = 0;
        $crashed = 0;

        EInvoicingConnection::query()
            ->where('company_verified', true)
            ->with('user.settings')
            ->chunkById(50, function (Collection $batch) use ($syncReceivedEInvoices, &$synced, &$refused, &$crashed): void {
                foreach ($batch as $connection) {
                    try {
                        $syncReceivedEInvoices->handle($connection->user);
                        $synced++;
                    } catch (EInvoicingPlatformException $exception) {
                        // Revoked credentials or a platform down for the night:
                        // the connection records why, and the Dépenses page says so.
                        $refused++;
                        Log::warning('Could not sync an e-invoicing inbox.', [
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

        $this->components->info("Synced {$synced} inbox(es), {$refused} refused by the platform, {$crashed} failed.");

        return $crashed > 0 ? self::FAILURE : self::SUCCESS;
    }
}
