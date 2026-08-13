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

    private const string UNAVAILABLE_KEY = 'official-rates:unavailable';

    private const int UNAVAILABLE_MINUTES = 15;

    public function __construct(private readonly MonEntrepriseClient $client) {}

    /**
     * @param  bool  $force  Bypass the shared cache and read URSSAF again. Set
     *                       for « Vérifier maintenant », which promises the user
     *                       a check rather than a repeat of someone else's.
     *
     * @throws RatesUnavailable
     */
    public function handle(UserSettings $settings, bool $force = false): UserSettings
    {
        $rates = $this->read(RateSituation::fromSettings($settings), $force);

        $settings->update([
            'contribution_rate_bp' => $rates->contributionRateBp,
            'liberating_payment_rate_bp' => $rates->liberatingPaymentRateBp,
            'rates_year' => $rates->year,
            'rates_checked_at' => $rates->readAt,
        ]);

        return $settings;
    }

    private function read(RateSituation $situation, bool $force): OfficialRates
    {
        $key = "official-rates:{$situation->signature()}";

        if ($force) {
            Cache::forget($key);
            Cache::forget(self::UNAVAILABLE_KEY);
        }

        $cached = Cache::remember(
            $key,
            CarbonImmutable::now()->addHours(self::CACHE_HOURS),
            function () use ($situation): array {
                if (Cache::has(self::UNAVAILABLE_KEY)) {
                    throw new RatesUnavailable('The official rate source was unreachable moments ago.');
                }

                try {
                    $fetched = $this->client->fetch($situation);
                } catch (RatesUnavailable $exception) {
                    Cache::put(self::UNAVAILABLE_KEY, true, CarbonImmutable::now()->addMinutes(self::UNAVAILABLE_MINUTES));

                    throw $exception;
                }

                return [
                    'contributionRateBp' => $fetched->contributionRateBp,
                    'liberatingPaymentRateBp' => $fetched->liberatingPaymentRateBp,
                    'year' => $fetched->year,
                    'readAt' => $fetched->readAt->toIso8601String(),
                ];
            },
        );

        return new OfficialRates(
            contributionRateBp: (int) $cached['contributionRateBp'],
            liberatingPaymentRateBp: (int) $cached['liberatingPaymentRateBp'],
            year: (int) $cached['year'],
            readAt: CarbonImmutable::parse((string) $cached['readAt']),
        );
    }
}
