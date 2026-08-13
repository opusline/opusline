<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Enums;

/**
 * What the "À traiter" list can put in front of you. Labels live on the frontend,
 * like every other enum here.
 */
enum InvoiceTodoKind: int
{
    case DraftToSend = 0;
    case Overdue = 1;
    case UnbilledWork = 2;
}
