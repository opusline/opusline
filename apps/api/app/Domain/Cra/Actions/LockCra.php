<?php

declare(strict_types=1);

namespace App\Domain\Cra\Actions;

use App\Domain\Cra\Models\Cra;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Serialize a state transition and hand the callback a freshly read CRA.
 *
 * The refresh is the point: a route-bound model was loaded before the lock existed,
 * so guarding on its status would test whatever was true when the request arrived,
 * not what is true now. Mirrors LockInvoice.
 */
class LockCra
{
    /**
     * @template TResult
     *
     * @param  callable(Cra): TResult  $mutate
     * @return TResult
     */
    public function handle(Cra $cra, callable $mutate): mixed
    {
        return DB::transaction(function () use ($cra, $mutate) {
            User::lockRow($cra->user_id);

            $cra->refresh();

            return $mutate($cra);
        });
    }
}
