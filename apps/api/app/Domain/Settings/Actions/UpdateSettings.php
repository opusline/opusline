<?php

declare(strict_types=1);

namespace App\Domain\Settings\Actions;

use App\Domain\Settings\Data\UpdateSettingsData;
use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Settings\Rates\RateSituation;
use App\Domain\Settings\Rates\RatesUnavailable;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Validation\AccountCurrency;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UpdateSettings
{
    public function __construct(private readonly RefreshOfficialRates $refreshOfficialRates) {}

    public function handle(UserSettings $settings, UpdateSettingsData $data): UserSettings
    {
        $situationBefore = RateSituation::fromSettings($settings)->signature();
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
            if ($data->treasuryBuffer instanceof MoneyData) {
                AccountCurrency::assertMatchesAccountUnderLock($settings->user_id, $data->treasuryBuffer);
            }

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
            ]);
        });

        if ($this->needsFreshRates($settings, $situationBefore, $wasFollowingOfficialRates)) {
            $this->applyOfficialRates($settings);
        }

        return $settings;
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

    private function applyOfficialRates(UserSettings $settings): void
    {
        try {
            $this->refreshOfficialRates->handle($settings);
        } catch (RatesUnavailable $exception) {
            $settings->update(['rates_checked_at' => null, 'rates_year' => null]);

            Log::warning('Settings saved without re-reading the barème.', [
                'user_id' => $settings->user_id,
                'reason' => $exception->getMessage(),
            ]);
        }
    }
}
