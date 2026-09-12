<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Shared\Calendar\CivilMonth;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Money\Rate;
use App\Domain\Shared\Validation\BeforeOrEqualAccountToday;
use Spatie\LaravelData\Attributes\Validation\AfterOrEqual;
use Spatie\LaravelData\Attributes\Validation\Between;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

/**
 * One shape for creating and replacing: the sheet always resends every field
 * it shows, so a PUT is a full replace. The rate-versus-treatment consistency
 * is a cross-field rule and lives in ValidateVatRate.
 */
class ExpenseInputData extends Data
{
    public function __construct(
        #[StringType, Min(1), Max(120)]
        public string $supplier,
        /** The receipt's date; a purchase already made is never post-dated, and the journal starts at 1900. */
        #[DateFormat('Y-m-d'), AfterOrEqual(CivilMonth::EARLIEST_DAY), Rule(new BeforeOrEqualAccountToday)]
        public string $spentOn,
        #[Enum(ExpenseCategory::class)]
        public ExpenseCategory $category,
        /** What the receipt says, TVA included; the HT figure is derived from it. */
        public MoneyData $amountTtc,
        #[Enum(ExpenseVatTreatment::class)]
        public ExpenseVatTreatment $vatTreatment,
        /** In basis points, whatever the account's country charges; 0 is a receipt whose TVA is not tracked. */
        #[IntegerType, Between(0, Rate::BASIS_POINTS)]
        public int $vatRateBp,
        /** The share used for the business, in basis points; only that share of the TVA is recoverable. */
        #[IntegerType, Min(0), Max(Rate::BASIS_POINTS)]
        public int $proShareBp = Rate::BASIS_POINTS,
        #[StringType, Max(255)]
        public ?string $description = null,
        /** Records the expense as that subscription's debit for its period (create only). */
        #[IntegerType, Min(1)]
        public ?int $subscriptionId = null,
        /** « Récurrent · le N du mois »: creates a monthly subscription from this expense, debiting on that day (create only). */
        #[IntegerType, Between(1, 31)]
        public ?int $recurringDebitDay = null,
    ) {}

    /** The `Y-m` journal the purchase is listed in. */
    public function month(): string
    {
        return substr($this->spentOn, 0, 7);
    }
}
