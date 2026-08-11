<?php

declare(strict_types=1);

namespace App\Domain\Settings\Actions;

use App\Domain\Settings\Data\UpdateSettingsData;
use App\Domain\Settings\Models\UserSettings;

class UpdateSettings
{
    public function handle(UserSettings $settings, UpdateSettingsData $data): UserSettings
    {
        $settings->update([
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
            'contribution_rate_bp' => $data->contributionRateBp,
            'liberating_payment' => $data->liberatingPayment,
            'liberating_payment_rate_bp' => $data->liberatingPaymentRateBp,
            'vat_regime' => $data->vatRegime,
            'default_payment_terms_days' => $data->defaultPaymentTermsDays,
            'invoice_number_format' => $data->invoiceNumberFormat,
            'treasury_buffer_cents' => $data->treasuryBuffer?->toMoney(),
        ]);

        return $settings;
    }
}
