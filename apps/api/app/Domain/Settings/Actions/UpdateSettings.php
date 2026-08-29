<?php

declare(strict_types=1);

namespace App\Domain\Settings\Actions;

use App\Domain\Deadlines\Actions\GenerateFiscalDeadlines;
use App\Domain\Deadlines\Actions\ResetDeadlineReminders;
use App\Domain\Deadlines\Actions\ResolveExpectedCfe;
use App\Domain\Settings\Data\UpdateSettingsData;
use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Settings\Jobs\RefreshOfficialRatesJob;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Settings\Rates\RateSituation;
use App\Domain\Shared\Validation\AccountCurrency;
use Illuminate\Support\Facades\DB;

class UpdateSettings
{
    public function __construct(
        private readonly GenerateFiscalDeadlines $generateFiscalDeadlines,
        private readonly ResolveExpectedCfe $resolveExpectedCfe,
        private readonly ResetDeadlineReminders $resetDeadlineReminders,
    ) {}

    /**
     * Mutates $settings in place; returns whether an official-rates refresh
     * was scheduled — the answer then still carries the stored rates.
     */
    public function handle(UserSettings $settings, UpdateSettingsData $data): bool
    {
        $situationBefore = RateSituation::fromSettings($settings)->signature();
        $calendarBefore = $this->generateFiscalDeadlines->signature(
            $settings,
            $this->resolveExpectedCfe->handle($settings)?->amount,
        );
        $wasFollowingOfficialRates = $settings->auto_rates;
        // Gate on the country being saved, not the stored one: moving the
        // business out of France must strip the French flags in the same write.
        $hasFrenchFiscality = $data->businessCountry === UserSettings::FRENCH_FISCALITY_COUNTRY;
        // The stored flag, not the submitted one: outside France autoRates is
        // forced off, and the rate-preservation branches below must agree with
        // it or a foreign payload's submitted rates would be silently dropped.
        $autoRates = $hasFrenchFiscality && $data->autoRates;

        DB::transaction(function () use ($settings, $data, $hasFrenchFiscality, $autoRates): void {
            // MoneyCast writes the currency column as a side effect of writing
            // the buffer, so a stale-currency buffer slipping past the request
            // rule would silently re-label the whole account.
            AccountCurrency::assertAllMatchAccountUnderLock(
                $settings->user_id,
                $data->treasuryBuffer,
                $data->cfeExpected,
            );

            $settings->update([
                'business_country' => $data->businessCountry,
                'locale' => $data->locale,
                'date_format' => $data->dateFormat,
                'timezone' => $data->timezone,
                'workday_minutes' => $data->workdayMinutes,
                'trade_name' => $data->tradeName,
                'siret' => $data->siret,
                'vat_number' => $data->vatNumber,
                'signature_city' => $data->signatureCity,
                'contact_email' => $data->contactEmail,
                'phone' => $data->phone,
                'company_address_line1' => $data->companyAddressLine1,
                'company_address_line2' => $data->companyAddressLine2,
                'company_postal_code' => $data->companyPostalCode,
                'company_city' => $data->companyCity,
                'home_address_same_as_company' => $data->homeAddressSameAsCompany,
                'home_address_line1' => $data->homeAddressLine1,
                'home_address_line2' => $data->homeAddressLine2,
                'home_postal_code' => $data->homePostalCode,
                'home_city' => $data->homeCity,
                'urssaf_periodicity' => $data->urssafPeriodicity,
                'contribution_rate_bp' => $autoRates
                    ? $settings->contribution_rate_bp
                    : $data->contributionRateBp,
                'liberating_payment_rate_bp' => $autoRates
                    ? $settings->liberating_payment_rate_bp
                    : $data->liberatingPaymentRateBp,
                // The URSSAF/TVA machinery is French law; outside France every
                // French-specific flag is forced off and the régime pinned so
                // effectiveVatRateBp() returns the stored rate verbatim. See
                // UserSettings::hasFrenchFiscality().
                'auto_rates' => $autoRates,
                'acre' => $hasFrenchFiscality && $data->acre,
                'business_started_on' => $data->businessStartedOn,
                'liberating_payment' => $hasFrenchFiscality && $data->liberatingPayment,
                'vat_regime' => $hasFrenchFiscality ? $data->vatRegime : VatRegime::ReelNormal,
                'default_vat_rate_bp' => $data->defaultVatRateBp,
                'default_payment_terms_days' => $data->defaultPaymentTermsDays,
                'invoice_number_format' => $data->invoiceNumberFormat,
                'treasury_buffer_cents' => $data->treasuryBuffer?->toMoney(),
                // The CFE is a French tax like the rest: outside France it is
                // dropped, not carried dormant.
                'cfe_expected_cents' => $hasFrenchFiscality ? $data->cfeExpected?->toMoney() : null,
            ]);
        });

        $calendarAfter = $this->generateFiscalDeadlines->signature(
            $settings,
            $this->resolveExpectedCfe->handle($settings)?->amount,
        );

        if ($calendarAfter !== $calendarBefore) {
            $this->resetDeadlineReminders->handle($settings);
        }

        // Scheduled, not awaited: the cache key derives from the very settings
        // that just changed, so this refresh is structurally always a cache
        // miss — a live call to URSSAF with a 10-second timeout that no save
        // should sit behind.
        $ratesRefreshing = $this->needsFreshRates($settings, $situationBefore, $wasFollowingOfficialRates);

        if ($ratesRefreshing) {
            RefreshOfficialRatesJob::dispatch($settings);
        }

        return $ratesRefreshing;
    }

    private function needsFreshRates(
        UserSettings $settings,
        string $situationBefore,
        bool $wasFollowingOfficialRates,
    ): bool {
        if (! $settings->hasFrenchFiscality() || ! $settings->auto_rates) {
            return false;
        }

        return ! $wasFollowingOfficialRates
            || RateSituation::fromSettings($settings)->signature() !== $situationBefore;
    }
}
