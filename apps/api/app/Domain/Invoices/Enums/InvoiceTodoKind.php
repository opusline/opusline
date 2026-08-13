<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Enums;

/**
 * What the "À traiter" list can put in front of you: money that was billed and has
 * not come in, and money that was worked and has not been billed. Drafts are not
 * here — an unsent draft is a note to self, not a debt.
 *
 * Labels live on the frontend, like every other enum here.
 */
enum InvoiceTodoKind: int
{
    case Overdue = 0;
    case UnbilledWork = 1;
}
