<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\EnableBanking\EnableBankingClient;
use App\Domain\Bank\EnableBanking\EnableBankingCredentials;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Ends the consent and forgets the connection. The synced movements and
 * their statement stay: they are the account's history.
 */
class DisconnectBankConnection
{
    public function __construct(
        private readonly EnableBankingClient $enableBankingClient,
    ) {}

    public function handle(User $user): void
    {
        $sessionId = DB::transaction(function () use ($user): ?string {
            $connection = User::lockRow($user->id)->bankConnection()->first();
            $connection?->delete();

            return $connection?->session_id;
        });

        $credentials = EnableBankingCredentials::of($user->settingsOrFail());

        if ($sessionId !== null && $credentials instanceof EnableBankingCredentials) {
            $this->enableBankingClient->revokeSession($credentials, $sessionId);
        }
    }
}
