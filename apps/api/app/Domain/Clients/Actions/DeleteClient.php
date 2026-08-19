<?php

declare(strict_types=1);

namespace App\Domain\Clients\Actions;

use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Shared\Database\ConstraintViolations;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;

class DeleteClient
{
    public function handle(Client $client): void
    {
        abort_if($client->invoices()->exists(), 409, __('invoices.cannot_delete_client_with_invoices'));
        abort_if($client->missions()->exists(), 409, __('clients.cannot_delete_with_missions'));

        try {
            DB::transaction(fn () => $client->delete());
        } catch (QueryException $exception) {
            if (ConstraintViolations::isForeignKeyViolation($exception)) {
                abort(409, Invoice::query()->where('client_id', $client->id)->exists()
                    ? __('invoices.cannot_delete_client_with_invoices')
                    : __('clients.cannot_delete_with_missions'));
            }

            throw $exception;
        }
    }
}
