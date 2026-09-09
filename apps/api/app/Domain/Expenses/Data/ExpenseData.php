<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Expenses\Models\Expense;
use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class ExpenseData extends Data
{
    public function __construct(
        public int $id,
        public string $supplier,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $spentOn,
        public ExpenseCategory $category,
        public ?string $description,
        public MoneyData $amountHt,
        /** The TVA the CA3 sees: invoiced, or self-assessed under reverse charge. */
        public MoneyData $vat,
        public MoneyData $amountTtc,
        /** The professional share of $vat — what the account may actually deduct. */
        public MoneyData $recoverableVat,
        public ExpenseVatTreatment $vatTreatment,
        public int $vatRateBp,
        public int $proShareBp,
        /** Null until a justificatif is attached; the TVA is not deductible before. */
        public ?ExpenseReceiptData $receipt,
    ) {}

    public static function fromModel(Expense $expense): self
    {
        $amounts = $expense->amounts();
        $receipt = $expense->receipt();

        return new self(
            id: $expense->id,
            supplier: $expense->supplier,
            spentOn: $expense->spent_on,
            category: $expense->category,
            description: $expense->description,
            amountHt: MoneyData::fromMoney($amounts->ht),
            vat: MoneyData::fromMoney($amounts->assessedVat()),
            amountTtc: MoneyData::fromMoney($amounts->ttc),
            recoverableVat: MoneyData::fromMoney($amounts->recoverableVat($expense->pro_share_bp)),
            vatTreatment: $expense->vat_treatment,
            vatRateBp: $expense->vat_rate_bp,
            proShareBp: $expense->pro_share_bp,
            receipt: $receipt instanceof Media ? ExpenseReceiptData::fromMedia($receipt) : null,
        );
    }
}
