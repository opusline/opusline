<?php

declare(strict_types=1);

namespace App\Domain\Clients\Actions;

use App\Domain\Clients\Models\Client;
use Illuminate\Database\QueryException;

class DeleteClient
{
    public function handle(Client $client): void
    {
        abort_if($client->missions()->exists(), 409, __('clients.cannot_delete_with_missions'));

        try {
            $client->delete();
            // @phpstan-ignore catch.neverThrown (delete() hits the missions foreign key restriction at runtime)
        } catch (QueryException $exception) {
            // A mission created between the check and the delete trips the
            // foreign key restriction — surface it as the same conflict.
            abort_if((string) $exception->getCode() === '23000', 409, __('clients.cannot_delete_with_missions'));

            throw $exception;
        }
    }
}
