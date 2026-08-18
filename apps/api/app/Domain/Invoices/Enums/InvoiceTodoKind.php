<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Enums;

/**
 * What the "À traiter" list can put in front of you: money that was billed and has
 * not come in, money that was worked and has not been billed, and an instalment of
 * a fixed price the contract says is now due. Drafts are not here — an unsent draft
 * is a note to self, not a debt.
 *
 * The three are different in kind, not degree. Unbilled work is value already
 * earned; a billing step is a term of the contract coming round. They are never
 * summed together, because against the same forfait they would count it twice.
 *
 * Labels live on the frontend, like every other enum here.
 */
enum InvoiceTodoKind: int
{
    case Overdue = 0;
    case UnbilledWork = 1;
    case BillingStep = 2;
}
