<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Documents\PaperDocument;
use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Shared\Data\SignedMoneyData;
use App\Domain\Shared\Money\Rate;
use Spatie\LaravelData\Attributes\Validation\Between;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

/** @phpstan-import-type PaperLine from PaperDocument */
class InvoiceLineInputData extends Data
{
    public function __construct(
        #[Max(255)]
        public string $label,
        /** Thousandths: 1500 is 1,5 days. */
        #[IntegerType, Between(1, 100_000_000)]
        public int $quantityMilli,
        #[Enum(LineUnit::class)]
        public LineUnit $unit,
        /** Before tax. Negative for a deduction line. */
        public SignedMoneyData $unitPrice,
        #[IntegerType, Between(0, Rate::BASIS_POINTS)]
        public int $vatRateBp,
        #[Max(1000)]
        public ?string $detail = null,
    ) {}

    /**
     * The line as the live preview prints it: under the franchise no line
     * carries VAT, whatever the editor sent.
     *
     * @return PaperLine
     */
    public function toPaperLine(bool $vatApplies): array
    {
        return [
            'label' => $this->label,
            'detail' => $this->detail,
            'quantityMilli' => $this->quantityMilli,
            'unit' => $this->unit,
            'unitPrice' => $this->unitPrice->toMoney(),
            'vatRateBp' => $vatApplies ? $this->vatRateBp : 0,
        ];
    }
}
