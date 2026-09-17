<?php

declare(strict_types=1);

namespace Opusline\BankStatements;

/** Consumers persist hashes derived from this output: changing the table re-keys them. */
final class FoldAccents
{
    public static function fold(string $text): string
    {
        return strtr(mb_strtoupper($text), [
            'É' => 'E', 'È' => 'E', 'Ê' => 'E', 'Ë' => 'E',
            'À' => 'A', 'Â' => 'A', 'Î' => 'I', 'Ï' => 'I',
            'Ô' => 'O', 'Û' => 'U', 'Ù' => 'U', 'Ü' => 'U',
            'Ç' => 'C', 'Œ' => 'OE',
        ]);
    }
}
