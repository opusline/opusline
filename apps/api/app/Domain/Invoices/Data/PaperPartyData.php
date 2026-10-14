<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Data;

class PaperPartyData extends Data
{
    /**
     * @param  list<string>  $lines
     */
    public function __construct(
        /** With « EI » after an entrepreneur individuel's name. */
        public string $name,
        public array $lines,
    ) {}
}
