<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Data\StartBankConnectionData;
use App\Domain\Bank\EnableBanking\Aspsp;
use App\Domain\Bank\EnableBanking\EnableBankingClient;
use App\Domain\Bank\EnableBanking\EnableBankingCredentials;
use App\Domain\Features\Enums\FeatureFlag;
use App\Domain\Features\FeatureFlags;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;

/**
 * Opens an authorization at the chosen bank and hands back the URL to send
 * the browser to. Nothing is stored on the account yet: the connection only
 * exists once the bank sends the user back with a code.
 *
 * The authorization either renews one connection or adds a new one. Without
 * the multi-account beta there is only ever one connection, so asking for a
 * new one renews it — as connecting always did.
 */
class StartBankConnection
{
    /** Long enough to find a phone and pass the bank's strong authentication. */
    public const int STATE_TTL_MINUTES = 60;

    /** Used when the bank states no maximum consent length. */
    private const int FALLBACK_CONSENT_DAYS = 90;

    public function __construct(
        private readonly ListBankAspsps $listBankAspsps,
        private readonly EnableBankingClient $enableBankingClient,
        private readonly FeatureFlags $featureFlags,
    ) {}

    public function handle(User $user, StartBankConnectionData $data): string
    {
        $credentials = EnableBankingCredentials::ofOrFail($user->settingsOrFail());
        $aspsp = array_find(
            $this->listBankAspsps->handle($user),
            static fn (Aspsp $candidate): bool => $candidate->name === $data->aspspName,
        );

        if (! $aspsp instanceof Aspsp) {
            throw ValidationException::withMessages(['aspspName' => __('bank.sync_unknown_bank')]);
        }

        if (! $aspsp->supports($data->psuType)) {
            throw ValidationException::withMessages(['psuType' => __('bank.sync_psu_type_unsupported')]);
        }

        $connectionId = $this->connectionToRenew($user, $data->connectionId);

        // The bank hands the state back through the SPA's query string, which
        // the router JSON-parses: the leading letter keeps an all-digit draw
        // from turning into a number and losing digits on the way.
        $state = 's'.bin2hex(random_bytes(16));

        Cache::put(self::stateKey($state), [
            'userId' => $user->id,
            'aspspName' => $aspsp->name,
            'connectionId' => $connectionId,
        ], now()->addMinutes(self::STATE_TTL_MINUTES));

        return $this->enableBankingClient->startAuthorization(
            credentials: $credentials,
            aspsp: $aspsp,
            psuType: $data->psuType,
            state: $state,
            redirectUrl: config()->string('services.enable_banking.redirect_url'),
            validUntil: $this->consentEnd($aspsp),
        );
    }

    private function connectionToRenew(User $user, ?int $requestedId): ?int
    {
        if ($requestedId !== null) {
            if (! $user->bankConnections()->whereKey($requestedId)->exists()) {
                throw ValidationException::withMessages(['connectionId' => __('bank.sync_unknown_connection')]);
            }

            return $requestedId;
        }

        if ($this->featureFlags->isActive($user, FeatureFlag::BankAccounts)) {
            return null;
        }

        return $user->bankConnections()->orderBy('id')->first()?->id;
    }

    /** The cache key binding an authorization in flight to the account that opened it. */
    public static function stateKey(string $state): string
    {
        return 'bank-connection-state:'.$state;
    }

    /**
     * As long as the bank allows, less an hour so clock drift between here and
     * the bank never asks for more than its maximum.
     */
    private function consentEnd(Aspsp $aspsp): CarbonImmutable
    {
        $now = CarbonImmutable::now();

        if ($aspsp->maximumConsentSeconds <= 0) {
            return $now->addDays(self::FALLBACK_CONSENT_DAYS);
        }

        return $now->addSeconds($aspsp->maximumConsentSeconds)->subHour();
    }
}
