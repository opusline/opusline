<?php

declare(strict_types=1);

namespace App\Domain\Bank\Parsing;

use Carbon\CarbonImmutable;

final class StatementDate
{
    /**
     * A calendar day validated part by part — never DateTime's silent overflow,
     * where a "32/01" typo would quietly become the 1st of February.
     */
    public static function fromParts(int $year, int $month, int $day): CarbonImmutable
    {
        if (! checkdate($month, $day, $year)) {
            throw new StatementParseException('bank.unreadable_file');
        }

        return CarbonImmutable::create($year, $month, $day)
            ?? throw new StatementParseException('bank.unreadable_file');
    }
}
