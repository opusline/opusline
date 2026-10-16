<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Enums;

/** A mandatory invoice mention since 1 September 2026 (e-invoicing reform). */
enum OperationCategory: int
{
    case Services = 0;
    case Goods = 1;
    case Mixed = 2;
}
