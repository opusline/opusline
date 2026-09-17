<?php

declare(strict_types=1);

namespace Opusline\BankStatements;

use Carbon\CarbonImmutable;

final readonly class ParsedMovement
{
    /**
     * @param  ?int  $balanceAfter  the file's own balance after this row, when it states one
     */
    public function __construct(
        public CarbonImmutable $bookedOn,
        public string $label,
        public int $amountCents,
        public ?string $fitid = null,
        public ?int $balanceAfter = null,
    ) {}
}
