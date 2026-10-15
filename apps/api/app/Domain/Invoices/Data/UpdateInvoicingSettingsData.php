<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Enums\InvoicingMode;
use App\Domain\Invoices\Enums\OperationCategory;
use App\Domain\Shared\Validation\LegalPaymentTerms;
use App\Domain\Users\Models\User;
use Spatie\LaravelData\Attributes\Validation\Between;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

class UpdateInvoicingSettingsData extends Data
{
    public function __construct(
        public InvoicingMode $mode,
        public int $defaultPaymentTermsDays,
        public bool $defaultPaymentTermsEndOfMonth,
        #[IntegerType, Between(1, 365)]
        public int $quoteValidityDays,
        public OperationCategory $operationCategory,
        public bool $showIbanOnInvoices,
        public bool $showEmailOnDocuments,
        public bool $vatOnDebits,
        public DocumentLanguage $documentLanguage,
        /** A rate below the legal minimum is the account's to choose; the screen warns, the API does not refuse. */
        #[IntegerType, Between(0, 10000)]
        public ?int $latePenaltyRateBp = null,
        #[Max(2000)]
        public ?string $customMentions = null,
    ) {}

    /**
     * A rules() entry replaces every inferred rule for its property, hence
     * `required` and `integer` spelled out beside the legal cap.
     *
     * @return array<string, list<mixed>>
     */
    public static function rules(): array
    {
        $settings = request()->user() instanceof User ? request()->user()->settingsOrFail() : null;

        return [
            'defaultPaymentTermsDays' => ['required', 'integer', new LegalPaymentTerms(
                'defaultPaymentTermsEndOfMonth',
                storedDays: $settings?->default_payment_terms_days,
                storedEndOfMonth: $settings?->default_payment_terms_end_of_month,
            )],
        ];
    }
}
