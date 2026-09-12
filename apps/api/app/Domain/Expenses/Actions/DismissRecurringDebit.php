<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Bank\Actions\NormalizeBankText;
use App\Domain\Expenses\Data\DismissRecurringDebitData;
use App\Domain\Users\Models\User;

class DismissRecurringDebit
{
    public function handle(User $user, DismissRecurringDebitData $data): void
    {
        $user->recurringDebitDismissals()->firstOrCreate([
            'label_key' => NormalizeBankText::normalize($data->label),
            'amount_cents' => $data->amount->amount,
        ]);
    }
}
