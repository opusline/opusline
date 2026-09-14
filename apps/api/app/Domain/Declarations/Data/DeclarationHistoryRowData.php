<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Data;

use Spatie\LaravelData\Data;

/**
 * One month of the history table. Null-shaped like the screen's blocks: no
 * URSSAF while the quarter holding the month is still running, no TVA
 * outside réel normal.
 */
class DeclarationHistoryRowData extends Data
{
    public function __construct(
        public string $period,
        public ?DeclarationHistoryUrssafData $urssaf,
        public ?DeclarationHistoryVatData $vat,
    ) {}
}
