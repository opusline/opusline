<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Shared\Validation\LegalPaymentTerms;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\Validation\Between;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;

/** An invoice drafted in Opusline: everything the editor holds, its lines included. */
class SaveInvoiceDraftData extends Data
{
    /**
     * @param  list<InvoiceLineInputData>  $lines
     */
    public function __construct(
        #[IntegerType]
        public int $clientId,
        #[IntegerType, Rule(new LegalPaymentTerms('paymentTermsEndOfMonth'))]
        public int $paymentTermsDays,
        public bool $paymentTermsEndOfMonth,
        public bool $showIban,
        public bool $showEmail,
        #[Enum(DocumentLanguage::class)]
        public DocumentLanguage $language,
        #[DataCollectionOf(InvoiceLineInputData::class), Max(200)]
        public array $lines,
        #[IntegerType]
        public ?int $missionId = null,
        #[Max(255)]
        public ?string $title = null,
        #[Max(2000)]
        public ?string $description = null,
        /** The date the draft will carry; validation re-dates it to the day it is issued. */
        #[DateFormat('Y-m-d')]
        public ?string $issuedOn = null,
        #[DateFormat('Y-m-d')]
        public ?string $periodStart = null,
        #[DateFormat('Y-m-d')]
        public ?string $periodEnd = null,
        #[IntegerType, Between(0, 10000)]
        public ?int $latePenaltyRateBp = null,
        #[Max(2000)]
        public ?string $customMentions = null,
    ) {}
}
