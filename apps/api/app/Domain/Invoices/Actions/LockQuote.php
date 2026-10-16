<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Models\Quote;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

/** Serialize a state transition and hand the callback a freshly read quote. Mirrors LockInvoice. */
class LockQuote
{
    /**
     * @template TResult
     *
     * @param  callable(Quote): TResult  $mutate
     * @return TResult
     */
    public function handle(Quote $quote, callable $mutate): mixed
    {
        return DB::transaction(function () use ($quote, $mutate) {
            User::lockRow($quote->user_id);
            $quote->refresh();

            return $mutate($quote);
        });
    }
}
