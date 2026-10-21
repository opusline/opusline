<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\EnableBanking\EnableBankingClient;
use App\Domain\Bank\EnableBanking\EnableBankingCredentials;
use App\Domain\Bank\Models\BankConnection;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Ends the consent and forgets the connection. The bank account, its synced
 * movements and their statement stay: they are the account's history.
 */
class DisconnectBankConnection
{
    public function __construct(
        private readonly EnableBankingClient $enableBankingClient,
    ) {}

    public function handle(User $user, BankConnection $connection): void
    {
        $sessionId = DB::transaction(function () use ($user, $connection): ?string {
            $current = User::lockRow($user->id)->bankConnections()->whereKey($connection->id)->first();
            $current?->delete();

            return $current?->session_id;
        });

        $credentials = EnableBankingCredentials::of($user->settingsOrFail());

        if ($sessionId !== null && $credentials instanceof EnableBankingCredentials) {
            $this->enableBankingClient->revokeSession($credentials, $sessionId);
        }
    }
}
