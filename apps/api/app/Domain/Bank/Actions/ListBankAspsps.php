<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\EnableBanking\Aspsp;
use App\Domain\Bank\EnableBanking\EnableBankingClient;
use App\Domain\Bank\EnableBanking\EnableBankingCredentials;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\Cache;

class ListBankAspsps
{
    /** Long enough for the dialog's list and the connection that follows to share one read. */
    private const int CACHE_MINUTES = 60;

    public function __construct(
        private readonly EnableBankingClient $enableBankingClient,
    ) {}

    /**
     * The banks of the account's business country, as its own Enable Banking
     * application sees them — a sandbox application lists mock banks, hence
     * the cache keyed on the application rather than shared by the instance.
     *
     * @return list<Aspsp>
     */
    public function handle(User $user): array
    {
        $settings = $user->settingsOrFail();
        $credentials = EnableBankingCredentials::ofOrFail($settings);

        /** @var list<Aspsp> */
        return Cache::remember(
            "enable-banking-aspsps:{$credentials->applicationId}:{$settings->business_country}",
            now()->addMinutes(self::CACHE_MINUTES),
            fn (): array => $this->enableBankingClient->aspsps($credentials, $settings->business_country),
        );
    }
}
