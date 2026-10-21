<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\EnableBanking\EnableBankingClient;
use App\Domain\Bank\EnableBanking\EnableBankingCredentials;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Forgets the account's Enable Banking application and the bank connections
 * that depended on it. The movements already synced stay: they are the
 * account's history, not the connection's.
 */
class DeleteEnableBankingCredentials
{
    public function __construct(
        private readonly EnableBankingClient $enableBankingClient,
    ) {}

    public function handle(User $user): void
    {
        [$credentials, $sessionIds] = DB::transaction(function () use ($user): array {
            $locked = User::lockRow($user->id);
            $settings = $locked->settings()->sole();
            $credentials = EnableBankingCredentials::of($settings);
            /** @var list<string> $sessionIds */
            $sessionIds = $locked->bankConnections()->pluck('session_id')->all();

            $locked->bankConnections()->delete();
            $settings->forceFill([
                'enable_banking_application_id' => null,
                'enable_banking_private_key' => null,
            ])->save();

            return [$credentials, $sessionIds];
        });

        if ($credentials instanceof EnableBankingCredentials) {
            foreach ($sessionIds as $sessionId) {
                $this->enableBankingClient->revokeSession($credentials, $sessionId);
            }
        }
    }
}
