<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Expenses\Enums\SubscriptionPeriodicity;
use App\Domain\Shared\Calendar\CivilMonth;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Money\Rate;
use Spatie\LaravelData\Attributes\Validation\AfterOrEqual;
use Spatie\LaravelData\Attributes\Validation\Between;
use Spatie\LaravelData\Attributes\Validation\BooleanType;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Attributes\Validation\Url;
use Spatie\LaravelData\Data;

/**
 * One shape for creating and replacing a subscription: the sheet resends
 * every field it shows. The amount is the price in force from today — a
 * change dated elsewhere goes through ChangeSubscriptionAmountData. The
 * cross-field rules live in ValidateSubscriptionTerms.
 */
class SubscriptionInputData extends Data
{
    public function __construct(
        #[StringType, Min(1), Max(120)]
        public string $supplier,
        #[Enum(ExpenseCategory::class)]
        public ExpenseCategory $category,
        public MoneyData $amountHt,
        #[Enum(ExpenseVatTreatment::class)]
        public ExpenseVatTreatment $vatTreatment,
        #[IntegerType, Between(0, Rate::BASIS_POINTS)]
        public int $vatRateBp,
        #[Enum(SubscriptionPeriodicity::class)]
        public SubscriptionPeriodicity $periodicity,
        #[IntegerType, Between(1, 31)]
        public int $debitDay,
        #[DateFormat('Y-m-d'), AfterOrEqual(CivilMonth::EARLIEST_DAY)]
        public string $startedOn,
        #[IntegerType, Min(0), Max(Rate::BASIS_POINTS)]
        public int $proShareBp = Rate::BASIS_POINTS,
        /** The month an annual subscription debits in — required then, meaningless otherwise (ValidateSubscriptionTerms). */
        #[IntegerType, Between(1, 12)]
        public ?int $debitMonth = null,
        #[StringType, Max(255)]
        public ?string $description = null,
        #[StringType, Url, Max(2048)]
        public ?string $customerSpaceUrl = null,
        #[BooleanType]
        public bool $autoCreateExpenses = true,
        /** Annual only: spread the debit over the year on the compte pro. */
        #[BooleanType]
        public bool $provisionMonthly = false,
    ) {}
}
