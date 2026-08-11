<?php

declare(strict_types=1);

namespace App\Domain\Settings\Actions;

use App\Domain\Settings\Models\UserSettings;
use App\Domain\Settings\Rates\MonEntrepriseClient;
use App\Domain\Settings\Rates\OfficialRates;
use App\Domain\Settings\Rates\RateSituation;
use App\Domain\Settings\Rates\RatesUnavailable;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Cache;

class RefreshOfficialRates
{
    private const int CACHE_HOURS = 24;

    public function __construct(private readonly MonEntrepriseClient $client) {}

    /**
     * @throws RatesUnavailable
     */
    public function handle(UserSettings $settings): UserSettings
    {
        $situation = RateSituation::fromSettings($settings);

        $cached = Cache::remember(
            "official-rates:{$situation->signature()}",
            CarbonImmutable::now()->addHours(self::CACHE_HOURS),
            function () use ($situation): array {
                $fetched = $this->client->fetch($situation);

                return [
                    'contributionRateBp' => $fetched->contributionRateBp,
                    'liberatingPaymentRateBp' => $fetched->liberatingPaymentRateBp,
                    'year' => $fetched->year,
                ];
            },
        );

        $rates = new OfficialRates(
            contributionRateBp: (int) $cached['contributionRateBp'],
            liberatingPaymentRateBp: (int) $cached['liberatingPaymentRateBp'],
            year: (int) $cached['year'],
        );

        $settings->update([
            'contribution_rate_bp' => $rates->contributionRateBp,
            'liberating_payment_rate_bp' => $rates->liberatingPaymentRateBp,
            'rates_year' => $rates->year,
            'rates_checked_at' => CarbonImmutable::now(),
        ]);

        return $settings;
    }
}
