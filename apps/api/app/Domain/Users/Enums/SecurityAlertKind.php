<?php

declare(strict_types=1);

namespace App\Domain\Users\Enums;

/**
 * The changes to how an account is entered that its owner is told about by
 * email. A sign-in is not one of them: only what widens, narrows or bypasses
 * the way in.
 */
enum SecurityAlertKind: int
{
    case PasswordChanged = 0;
    case TotpEnabled = 1;
    case TotpDisabled = 2;
    case PasskeyAdded = 3;
    case PasskeyRemoved = 4;
    case BrowserTrusted = 5;
    case RecoveryCodeUsed = 6;
    case RecoveryCodesRegenerated = 7;
    /** The last alert an account receives: whoever silences them does not do it quietly. */
    case AlertsTurnedOff = 8;
    /** Sent to the address that was replaced: the new one may not be the owner's. */
    case EmailChanged = 9;
}
