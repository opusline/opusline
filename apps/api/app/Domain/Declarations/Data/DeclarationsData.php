<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * Everything on the Déclarations screen for one month. Blocks are null-shaped
 * rather than gated: no URSSAF and no ceiling outside French fiscality, no
 * TVA outside réel normal — the client renders what exists.
 */
class DeclarationsData extends Data
{
    public function __construct(
        /** The shown month, `2026-07`. */
        public string $period,
        /** The month before, for the navigator. */
        public string $previousPeriod,
        /** The month after, null once the shown one is the latest closed month. */
        public ?string $nextPeriod,
        /** Whether the month was picked by the server (no `period` asked) rather than by the user. */
        public bool $isDefault,
        public ?UrssafDeclarationData $urssaf,
        public ?VatDeclarationData $vat,
        public ?RevenueCeilingData $cumulative,
        /** Null outside French fiscality, and for a year that closed before the business started. */
        public ?AnnualDeclarationsData $annual,
        /** @var list<DeclarationHistoryRowData> the shown month and the five before it, newest first; empty outside French fiscality */
        #[DataCollectionOf(DeclarationHistoryRowData::class)]
        public array $history,
    ) {}
}
