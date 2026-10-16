<?php

declare(strict_types=1);

namespace App\Domain\EInvoicing\Actions;

use App\Domain\EInvoicing\Models\EInvoicingConnection;
use App\Domain\EInvoicing\Platform\EInvoicingPlatformException;
use App\Domain\EInvoicing\SuperPdp\SuperPdpClient;
use App\Domain\EInvoicing\SuperPdp\SuperPdpCredentials;
use App\Domain\EInvoicing\SuperPdp\SuperPdpPlatform;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Asks Super PDP again about the saved application: a verification that
 * completed, an annuaire registration made since, or credentials revoked in
 * the meantime all show up here.
 */
class CheckSuperPdpConnection
{
    public function __construct(
        private readonly SuperPdpClient $client,
    ) {}

    /**
     * @throws EInvoicingPlatformException
     */
    public function handle(User $user): void
    {
        $credentials = SuperPdpCredentials::of(EInvoicingConnection::ofOrFail($user));

        $check = new SuperPdpPlatform($this->client, $credentials)->check();

        DB::transaction(function () use ($user, $credentials, $check): void {
            $connection = User::lockRow($user->id)->eInvoicingConnection()->first();

            // Replaced while the platform was answering: the answer is about
            // the old application and has nothing to say about this row.
            if ($connection instanceof EInvoicingConnection && $connection->client_id === $credentials->clientId) {
                $connection->recordCheck($check)->save();
            }
        });
    }
}
