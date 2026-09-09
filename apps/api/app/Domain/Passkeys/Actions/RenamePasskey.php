<?php

declare(strict_types=1);

namespace App\Domain\Passkeys\Actions;

use App\Domain\Passkeys\Models\Passkey;

class RenamePasskey
{
    public function handle(Passkey $passkey, string $name): Passkey
    {
        $passkey->name = $name;
        $passkey->save();

        return $passkey;
    }
}
