<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Data\SaveEnableBankingCredentialsData;
use App\Domain\Bank\EnableBanking\BankSyncFailed;
use App\Domain\Bank\EnableBanking\EnableBankingClient;
use App\Domain\Bank\EnableBanking\EnableBankingCredentials;
use App\Domain\Bank\Enums\BankConnectionStatus;
use App\Domain\Bank\Enums\BankSyncError;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Stores the account's Enable Banking application after asking Enable Banking
 * about it: a key it refuses, an application still inactive or one that would
 * not send the browser back here all fail now, with the fix named, instead of
 * halfway through the first connection.
 */
class SaveEnableBankingCredentials
{
    public function __construct(
        private readonly EnableBankingClient $enableBankingClient,
    ) {}

    public function handle(User $user, SaveEnableBankingCredentialsData $data): void
    {
        $credentials = new EnableBankingCredentials($data->applicationId, $data->privateKey);
        $redirectUrl = config()->string('services.enable_banking.redirect_url');

        try {
            $application = $this->enableBankingClient->application($credentials);
        } catch (BankSyncFailed $exception) {
            if ($exception->reason === BankSyncError::CredentialsRejected) {
                throw ValidationException::withMessages(['privateKey' => __('settings.enable_banking_credentials_rejected')]);
            }

            throw $exception;
        }

        if (! $application->allowsRedirectTo($redirectUrl)) {
            throw ValidationException::withMessages([
                'applicationId' => __('settings.enable_banking_redirect_missing', ['url' => $redirectUrl]),
            ]);
        }

        if (! $application->isActive) {
            throw ValidationException::withMessages(['applicationId' => __('settings.enable_banking_inactive')]);
        }

        [$previousCredentials, $orphanedSessionId] = DB::transaction(function () use ($user, $data): array {
            $locked = User::lockRow($user->id);
            $settings = $locked->settings()->sole();
            $previousCredentials = EnableBankingCredentials::of($settings);

            $settings->forceFill([
                'enable_banking_application_id' => $data->applicationId,
                'enable_banking_private_key' => $data->privateKey,
            ])->save();

            $connection = $locked->bankConnection()->first();

            if ($connection === null || $previousCredentials?->applicationId === $data->applicationId) {
                return [null, null];
            }

            // A session belongs to the application that opened it: under
            // another one it is unreachable, so the user has to authorize again.
            $connection->forceFill(['status' => BankConnectionStatus::Expired])->save();

            return [$previousCredentials, $connection->session_id];
        });

        if ($previousCredentials instanceof EnableBankingCredentials && $orphanedSessionId !== null) {
            $this->enableBankingClient->revokeSession($previousCredentials, $orphanedSessionId);
        }
    }
}
