<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Models\Invoice;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Serialize a state transition and hand the callback a freshly read invoice.
 *
 * The refresh is the point: a route-bound model was loaded before the lock existed,
 * so guarding on its status would test whatever was true when the request arrived,
 * not what is true now. Mirrors LockUserTimer.
 */
class LockInvoice
{
    /**
     * @template TResult
     *
     * @param  callable(Invoice): TResult  $mutate
     * @return TResult
     */
    public function handle(Invoice $invoice, callable $mutate): mixed
    {
        return DB::transaction(function () use ($invoice, $mutate) {
            User::query()->whereKey($invoice->user_id)->lockForUpdate()->firstOrFail();

            $invoice->refresh();

            return $mutate($invoice);
        });
    }
}
