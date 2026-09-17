<?php

declare(strict_types=1);

namespace Opusline\BankStatements;

enum StatementParseFailure
{
    case UnreadableFile;
    case NoMovements;
    case TooManyMovements;
}
