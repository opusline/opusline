<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\EnableBanking\Aspsp;
use App\Domain\Bank\EnableBanking\EnableBankingClient;
use App\Domain\Bank\EnableBanking\EnableBankingCredentials;
use App\Domain\Bank\Enums\BankPsuType;
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
     * The cache holds scalars only: `cache.serializable_classes` is false, so
     * an object would come back from any serializing store as an incomplete class.
     *
     * @return list<Aspsp>
     */
    public function handle(User $user): array
    {
        $settings = $user->settingsOrFail();
        $credentials = EnableBankingCredentials::ofOrFail($settings);

        /** @var list<array{name: string, country: string, psuTypes: list<int>, maximumConsentSeconds: int, isBeta: bool}> $cached */
        $cached = Cache::remember(
            "enable-banking-aspsps:v2:{$credentials->applicationId}:{$settings->business_country}",
            now()->addMinutes(self::CACHE_MINUTES),
            fn (): array => array_map(
                static fn (Aspsp $aspsp): array => [
                    'name' => $aspsp->name,
                    'country' => $aspsp->country,
                    'psuTypes' => array_map(static fn (BankPsuType $psuType): int => $psuType->value, $aspsp->psuTypes),
                    'maximumConsentSeconds' => $aspsp->maximumConsentSeconds,
                    'isBeta' => $aspsp->isBeta,
                ],
                $this->enableBankingClient->aspsps($credentials, $settings->business_country),
            ),
        );

        return array_map(static fn (array $aspsp): Aspsp => new Aspsp(
            name: $aspsp['name'],
            country: $aspsp['country'],
            psuTypes: array_map(BankPsuType::from(...), $aspsp['psuTypes']),
            maximumConsentSeconds: $aspsp['maximumConsentSeconds'],
            isBeta: $aspsp['isBeta'],
        ), $cached);
    }
}
