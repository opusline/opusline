<?php

declare(strict_types=1);

namespace App\Domain\EInvoicing\Actions;

use App\Domain\EInvoicing\Models\EInvoicingConnection;
use App\Domain\EInvoicing\Platform\EInvoicingPlatformException;
use App\Domain\EInvoicing\SuperPdp\SuperPdpClient;
use App\Domain\EInvoicing\SuperPdp\SuperPdpCredentials;
use App\Domain\EInvoicing\SuperPdp\SuperPdpPlatform;
use App\Domain\Users\Models\User;

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
        $connection = $user->eInvoicingConnection()->first();
        $credentials = SuperPdpCredentials::ofOrFail($connection);

        $check = new SuperPdpPlatform($this->client, $credentials)->check();

        /** @var EInvoicingConnection $connection */
        $connection->forceFill(ConnectSuperPdp::snapshot($check))->save();
    }
}
