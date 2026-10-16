<?php

declare(strict_types=1);

namespace App\Domain\EInvoicing\Actions;

use App\Domain\EInvoicing\Data\SaveSuperPdpCredentialsData;
use App\Domain\EInvoicing\Enums\EInvoicingError;
use App\Domain\EInvoicing\Enums\EInvoicingPlatformKind;
use App\Domain\EInvoicing\Platform\EInvoicingPlatformException;
use App\Domain\EInvoicing\SuperPdp\SuperPdpClient;
use App\Domain\EInvoicing\SuperPdp\SuperPdpCredentials;
use App\Domain\EInvoicing\SuperPdp\SuperPdpPlatform;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Stores the account's Super PDP application after asking the platform about
 * it: credentials it refuses fail now, on the field, and what it says about
 * the company is kept with them so the settings page needs no further call.
 */
class ConnectSuperPdp
{
    public function __construct(
        private readonly SuperPdpClient $client,
    ) {}

    public function handle(User $user, SaveSuperPdpCredentialsData $data): void
    {
        $credentials = new SuperPdpCredentials($data->clientId, $data->clientSecret);

        try {
            $check = new SuperPdpPlatform($this->client, $credentials)->check();
        } catch (EInvoicingPlatformException $exception) {
            if ($exception->reason === EInvoicingError::CredentialsRejected) {
                throw ValidationException::withMessages(['clientSecret' => __('einvoicing.credentials_rejected')]);
            }

            throw $exception;
        }

        DB::transaction(function () use ($user, $credentials, $check): void {
            User::lockRow($user->id)->eInvoicingConnection()->firstOrNew()->fill([
                'platform' => EInvoicingPlatformKind::SuperPdp,
                'client_id' => $credentials->clientId,
                'client_secret' => $credentials->clientSecret,
            ])->recordCheck($check)->save();
        });
    }
}
