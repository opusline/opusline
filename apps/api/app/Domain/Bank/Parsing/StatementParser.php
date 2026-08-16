<?php

declare(strict_types=1);

namespace App\Domain\Bank\Parsing;

interface StatementParser
{
    /**
     * @param  string  $text  UTF-8 statement contents
     *
     * @throws StatementParseException
     */
    public function parse(string $text): ParsedStatement;
}
