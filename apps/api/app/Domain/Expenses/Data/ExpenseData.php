<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Bank\Models\BankMovement;
use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Enums\ExpenseVatStatus;
use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Expenses\Models\Expense;
use App\Domain\Expenses\Models\Subscription;
use App\Domain\Expenses\Vat\DeclaredCa3Months;
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
        /** Set when the expense is a subscription's debit; eager-load `subscription`. */
        public ?ExpenseSubscriptionData $subscription,
        /** The compte pro debit that paid it, once linked; eager-load `bankMovement`. */
        public ?ExpenseBankMovementData $bankMovement,
        public ExpenseVatStatus $vatStatus,
        /** `Y-m` — the CA3 the recoverable TVA is claimed on. */
        public string $vatClaimPeriod,
        /** The purchase month was declared without this row: the CA3 lists it as « autre TVA à déduire » (case 21). */
        public bool $isRegularisation,
    ) {}

    /** @param  ?DeclaredCa3Months  $declared  null for an account that files no CA3 */
    public static function fromModel(Expense $expense, ?DeclaredCa3Months $declared): self
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
            subscription: $expense->subscription instanceof Subscription ? ExpenseSubscriptionData::fromModel($expense->subscription) : null,
            bankMovement: $expense->bankMovement instanceof BankMovement ? ExpenseBankMovementData::fromModel($expense->bankMovement) : null,
            vatStatus: $expense->vatStatus($declared),
            vatClaimPeriod: $expense->vat_claim_period,
            isRegularisation: $expense->isRegularisation($declared),
        );
    }
}
