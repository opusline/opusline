<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/**
 * One month of the journal, with everything the screen derives from it. Every
 * write answers with this rather than the row alone: the KPIs and the bars
 * move with each expense, and the client would only refetch them anyway.
 */
class ExpensesMonthData extends Data
{
    /**
     * @param  list<ExpenseCategoryTotalData>  $categories
     * @param  list<ExpenseMonthPointData>  $series
     * @param  list<ExpenseData>  $expenses
     */
    public function __construct(
        /** `Y-m`. */
        public string $month,
        /** The day this month's CA3 was marked declared, when it was. */
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $declaredOn,
        /** Null unless the account files a monthly CA3 (French fiscality, réel normal). */
        public ?ExpensesVatSummaryData $vat,
        public ExpensesTotalsData $totals,
        public array $categories,
        /** The twelve months ending with $month, oldest first. */
        public array $series,
        /** Null outside French fiscality: the micro-BNC comparison means nothing elsewhere. */
        public ?ExpenseRegimeProjectionData $projection,
        public array $expenses,
    ) {}
}
