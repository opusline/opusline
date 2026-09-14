<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Data;

use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * The URSSAF declaration helper: the one figure to retype on
 * autoentrepreneur.urssaf.fr, the period it covers — the shown month, or the
 * quarter holding it for a quarterly account — and what the site will ask
 * for it, line by line.
 */
class UrssafDeclarationData extends Data
{
    public function __construct(
        /** The declared period's key — `2026-07` or `2026-Q2`, matching the web period vocabulary. */
        public string $period,
        public UrssafPeriodicity $periodicity,
        /** False when the shown month's quarter is still running and the previous, fileable one is shown instead. */
        public bool $coversShownMonth,
        /** CA encaissé HT over the period — the number the form asks for. */
        public MoneyData $base,
        /** How many invoices were collected over the period. */
        public int $invoiceCount,
        /** @var list<ContributionLineData> the settlement lines, in the order the site lists them */
        #[DataCollectionOf(ContributionLineData::class)]
        public array $lines,
        /** The sum of the lines — what the declaration will debit. */
        public MoneyData $total,
        /** Null for a period the account did not exist in. */
        public ?DeclarationDeadlineData $deadline,
        public ?DeclarationCompletionData $completion,
    ) {}
}
