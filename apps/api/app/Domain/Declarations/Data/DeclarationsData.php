<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Data;

use Spatie\LaravelData\Data;

/**
 * Everything on the Déclarations screen. Blocks are null-shaped rather than
 * gated: no URSSAF outside French fiscality, no TVA outside réel normal —
 * the client renders what exists.
 */
class DeclarationsData extends Data
{
    public function __construct(
        public ?UrssafDeclarationData $urssaf,
        public ?VatDeclarationData $vat,
    ) {}
}
