<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Data;

use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

/**
 * The URSSAF declaration helper: the one figure to retype on
 * autoentrepreneur.urssaf.fr, and the period it covers.
 */
class UrssafDeclarationData extends Data
{
    public function __construct(
        /** The declared period's key — `2026-07` or `2026-Q2`, matching the web period vocabulary. */
        public string $period,
        public UrssafPeriodicity $periodicity,
        /** CA encaissé HT over the period — the number the form asks for. */
        public MoneyData $base,
    ) {}
}
