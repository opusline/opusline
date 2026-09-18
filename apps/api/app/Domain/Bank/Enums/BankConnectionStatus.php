<?php

declare(strict_types=1);

namespace App\Domain\Bank\Enums;

enum BankConnectionStatus: int
{
    case Active = 0;

    /** The consent covers several accounts in the account currency; the user picks the one to sync. */
    case AwaitingAccount = 1;

    /** The consent ended or was revoked: nothing syncs until the user authorizes again at the bank. */
    case Expired = 2;
}
