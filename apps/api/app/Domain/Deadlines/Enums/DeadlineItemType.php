<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Enums;

/**
 * What one line of the Échéances timeline is. The order of the cases is also
 * the order two lines sharing a due date sort in: an invoice first, then the
 * relance it calls for, then the fisc.
 */
enum DeadlineItemType: int
{
    case InvoiceDue = 0;
    case InvoiceReminder = 1;
    case Fiscal = 2;
}
