<?php

declare(strict_types=1);

namespace App\Domain\EInvoicing\Actions;

use App\Domain\Users\Models\User;

/** Forgets the account's Super PDP application. The platform keeps the invoices it holds. */
class DisconnectSuperPdp
{
    public function handle(User $user): void
    {
        $user->eInvoicingConnection()->delete();
    }
}
