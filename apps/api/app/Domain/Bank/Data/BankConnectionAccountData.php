<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use App\Domain\Bank\EnableBanking\LinkedAccount;
use Spatie\LaravelData\Data;

class BankConnectionAccountData extends Data
{
    public function __construct(
        public string $uid,
        public ?string $name,
        /** The IBAN's last four characters: enough to tell accounts apart. */
        public ?string $ibanLast4,
    ) {}

    public static function fromLinkedAccount(LinkedAccount $account): self
    {
        return new self(uid: $account->uid, name: $account->name, ibanLast4: $account->ibanLast4);
    }
}
