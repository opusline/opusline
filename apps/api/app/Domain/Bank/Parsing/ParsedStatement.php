<?php

declare(strict_types=1);

namespace App\Domain\Bank\Parsing;

use Carbon\CarbonImmutable;

final readonly class ParsedStatement
{
    /**
     * @param  list<ParsedMovement>  $movements  in file order
     * @param  ?string  $currency  ISO 4217 code when the file states one
     */
    public function __construct(
        public array $movements,
        public ?int $closingBalanceCents = null,
        public ?CarbonImmutable $closingBalanceOn = null,
        public ?CarbonImmutable $periodStart = null,
        public ?CarbonImmutable $periodEnd = null,
        public ?string $currency = null,
    ) {}
}
