<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Enums\Currency;
use App\Domain\Shared\Money\Rate;
use App\Domain\Shared\Validation\AccountCurrency;
use App\Domain\Shared\Validation\LegalPaymentTerms;
use Illuminate\Validation\Rules\Enum as EnumRule;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\Validation\Between;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;

/** A quote drafted in Opusline: everything the editor holds, its lines included. */
class SaveQuoteDraftData extends Data
{
    /**
     * @param  list<InvoiceLineInputData>  $lines
     */
    public function __construct(
        #[IntegerType]
        public int $clientId,
        /** How long the offer stands, from the day it is validated. */
        #[IntegerType, Between(1, 365)]
        public int $validityDays,
        /** The terms the invoices will carry. */
        #[IntegerType, Rule(new LegalPaymentTerms('paymentTermsEndOfMonth'))]
        public int $paymentTermsDays,
        public bool $paymentTermsEndOfMonth,
        public bool $showEmail,
        #[Enum(DocumentLanguage::class)]
        public DocumentLanguage $language,
        #[DataCollectionOf(InvoiceLineInputData::class)]
        public array $lines,
        #[IntegerType]
        public ?int $missionId = null,
        #[Max(255)]
        public ?string $title = null,
        #[Max(2000)]
        public ?string $description = null,
        /** The date the draft carries; validation re-dates it to the day it is sent. */
        #[DateFormat('Y-m-d')]
        public ?string $issuedOn = null,
        /** Share of the total incl. VAT due on acceptance, in basis points; null for none. */
        #[IntegerType, Between(1, Rate::BASIS_POINTS)]
        public ?int $depositRateBp = null,
        #[Max(2000)]
        public ?string $customMentions = null,
    ) {}

    /**
     * Spelled out for the same reason as SaveInvoiceDraftData: a rules() entry
     * replaces every rule for its property, and the OpenAPI schema is built
     * from the resolved rules.
     *
     * @return array<string, list<mixed>>
     */
    public static function rules(): array
    {
        return [
            'lines' => ['present', 'array', 'max:200'],
            'lines.*.label' => ['required', 'string', 'max:255'],
            'lines.*.detail' => ['nullable', 'string', 'max:1000'],
            'lines.*.quantityMilli' => ['required', 'integer', 'between:1,100000000'],
            'lines.*.unit' => ['required', new EnumRule(LineUnit::class)],
            'lines.*.unitPrice' => ['required', 'array'],
            'lines.*.unitPrice.amount' => ['required', 'integer', 'min:'.-MoneyData::MAX_AMOUNT, 'max:'.MoneyData::MAX_AMOUNT],
            'lines.*.unitPrice.currency' => ['required', new EnumRule(Currency::class), new AccountCurrency],
            'lines.*.vatRateBp' => ['required', 'integer', 'between:0,'.Rate::BASIS_POINTS],
        ];
    }
}
