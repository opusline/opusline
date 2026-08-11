<?php

declare(strict_types=1);

namespace App\Domain\Settings\Data;

use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

class SettingsData extends Data
{
    public function __construct(
        public ?string $tradeName,
        public ?string $siret,
        public ?string $vatNumber,
        public ?string $signatureCity,
        public ?string $contactEmail,
        public ?string $phone,
        public ?string $companyAddressLine1,
        public ?string $companyAddressLine2,
        public ?string $companyPostalCode,
        public ?string $companyCity,
        public bool $homeAddressSameAsCompany,
        public ?string $homeAddressLine1,
        public ?string $homeAddressLine2,
        public ?string $homePostalCode,
        public ?string $homeCity,
        public UrssafPeriodicity $urssafPeriodicity,
        public bool $autoRates,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $businessStartedOn,
        public bool $acre,
        public ?string $ratesCheckedAt,
        public ?int $ratesYear,
        public int $contributionRateBp,
        public bool $liberatingPayment,
        public int $liberatingPaymentRateBp,
        public VatRegime $vatRegime,
        public bool $vatLiable,
        public int $effectiveContributionRateBp,
        public int $defaultPaymentTermsDays,
        public string $invoiceNumberFormat,
        public ?MoneyData $treasuryBuffer,
        public bool $hasSignature,
    ) {}

    public static function fromModel(UserSettings $settings, bool $hasSignature): self
    {
        return new self(
            tradeName: $settings->trade_name,
            siret: $settings->siret,
            vatNumber: $settings->vat_number,
            signatureCity: $settings->signature_city,
            contactEmail: $settings->contact_email,
            phone: $settings->phone,
            companyAddressLine1: $settings->company_address_line1,
            companyAddressLine2: $settings->company_address_line2,
            companyPostalCode: $settings->company_postal_code,
            companyCity: $settings->company_city,
            homeAddressSameAsCompany: $settings->home_address_same_as_company,
            homeAddressLine1: $settings->home_address_line1,
            homeAddressLine2: $settings->home_address_line2,
            homePostalCode: $settings->home_postal_code,
            homeCity: $settings->home_city,
            urssafPeriodicity: $settings->urssaf_periodicity,
            autoRates: $settings->auto_rates,
            businessStartedOn: $settings->business_started_on,
            acre: $settings->acre,
            ratesCheckedAt: $settings->rates_checked_at?->toIso8601String(),
            ratesYear: $settings->rates_year,
            contributionRateBp: $settings->contribution_rate_bp,
            liberatingPayment: $settings->liberating_payment,
            liberatingPaymentRateBp: $settings->liberating_payment_rate_bp,
            vatRegime: $settings->vat_regime,
            vatLiable: $settings->vat_regime->isLiable(),
            effectiveContributionRateBp: $settings->effectiveContributionRateBp(),
            defaultPaymentTermsDays: $settings->default_payment_terms_days,
            invoiceNumberFormat: $settings->invoice_number_format,
            treasuryBuffer: $settings->treasury_buffer_cents === null
                ? null
                : MoneyData::fromMoney($settings->treasury_buffer_cents),
            hasSignature: $hasSignature,
        );
    }
}
