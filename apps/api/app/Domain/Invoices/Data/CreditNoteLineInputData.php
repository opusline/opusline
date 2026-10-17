<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Money\Rate;
use Spatie\LaravelData\Attributes\Validation\Between;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

/** A line of a partial credit note: one taken back from the invoice, or typed freely. */
class CreditNoteLineInputData extends Data
{
    public function __construct(
        #[Max(255)]
        public string $label,
        /** Thousandths: 1500 is 1,5 days. */
        #[IntegerType, Between(1, 100_000_000)]
        public int $quantityMilli,
        #[Enum(LineUnit::class)]
        public LineUnit $unit,
        /** Before tax, positive: the credit note takes it off. */
        public MoneyData $unitPrice,
        #[IntegerType, Between(0, Rate::BASIS_POINTS)]
        public int $vatRateBp,
        #[Max(1000)]
        public ?string $detail = null,
        /** The invoice line it takes back, which fixes its VAT rate. */
        #[IntegerType]
        public ?int $invoiceLineId = null,
    ) {}
}
