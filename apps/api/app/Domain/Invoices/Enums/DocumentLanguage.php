<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Enums;

/** The language a document is rendered in, chosen per document; independent of the interface locale. */
enum DocumentLanguage: int
{
    case French = 0;
    case English = 1;
}
