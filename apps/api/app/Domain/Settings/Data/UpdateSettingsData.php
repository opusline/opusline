<?php

declare(strict_types=1);

namespace App\Domain\Settings\Data;

use App\Domain\Settings\Enums\DateFormat;
use App\Domain\Settings\Enums\Locale;
use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Validation\InvoiceNumberFormat;
use App\Domain\Shared\Validation\Siret;
use App\Domain\Shared\Validation\VatNumber;
use Spatie\LaravelData\Attributes\Validation\Between;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;

class UpdateSettingsData extends Data
{
    public function __construct(
        #[Regex('/^[A-Z]{2}$/')]
        public string $businessCountry,
        public Locale $locale,
        public DateFormat $dateFormat,
        public UrssafPeriodicity $urssafPeriodicity,
        public bool $autoRates,
        public bool $acre,
        #[IntegerType, Between(0, 10000)]
        public int $contributionRateBp,
        public bool $liberatingPayment,
        #[IntegerType, Between(0, 10000)]
        public int $liberatingPaymentRateBp,
        public VatRegime $vatRegime,
        #[IntegerType, Between(0, 10000)]
        public int $defaultVatRateBp,
        #[IntegerType, Between(0, 365)]
        public int $defaultPaymentTermsDays,
        #[Max(64), Rule(new InvoiceNumberFormat)]
        public string $invoiceNumberFormat,
        public bool $homeAddressSameAsCompany,
        #[Max(255)]
        public ?string $tradeName = null,
        #[Max(255), Rule(new Siret)]
        public ?string $siret = null,
        #[Max(255), Rule(new VatNumber)]
        public ?string $vatNumber = null,
        #[Max(255)]
        public ?string $signatureCity = null,
        #[Max(255), Email]
        public ?string $contactEmail = null,
        #[Max(64)]
        public ?string $phone = null,
        #[Max(255)]
        public ?string $companyAddressLine1 = null,
        #[Max(255)]
        public ?string $companyAddressLine2 = null,
        #[Max(32)]
        public ?string $companyPostalCode = null,
        #[Max(255)]
        public ?string $companyCity = null,
        #[Max(255)]
        public ?string $homeAddressLine1 = null,
        #[Max(255)]
        public ?string $homeAddressLine2 = null,
        #[Max(32)]
        public ?string $homePostalCode = null,
        #[Max(255)]
        public ?string $homeCity = null,
        public ?string $businessStartedOn = null,
        public ?MoneyData $treasuryBuffer = null,
    ) {}

    /**
     * @return array<string, list<mixed>>
     */
    public static function rules(): array
    {
        return [
            'businessStartedOn' => ['nullable', 'date_format:Y-m-d', 'required_if_accepted:acre'],
        ];
    }
}
