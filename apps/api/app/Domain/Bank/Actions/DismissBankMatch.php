<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Enums\BankMatchStatus;
use App\Domain\Bank\Models\BankMatch;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Declines a suggestion. The row stays, flipped to Dismissed: its unique
 * movement key then keeps the same pairing from resurfacing on the next
 * overlapping import.
 */
class DismissBankMatch
{
    public function handle(BankMatch $match): BankMatch
    {
        return DB::transaction(function () use ($match): BankMatch {
            User::lockRow($match->user_id);

            $match->refresh();

            abort_if($match->status !== BankMatchStatus::Pending, 409, __('bank.match_already_settled'));

            $match->update(['status' => BankMatchStatus::Dismissed]);

            return $match;
        });
    }
}
