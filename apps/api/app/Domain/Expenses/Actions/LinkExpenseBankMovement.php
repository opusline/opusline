<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Bank\Models\BankMovement;
use App\Domain\Expenses\Data\LinkExpenseBankMovementData;
use App\Domain\Expenses\Models\Expense;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Ties a purchase to the debit that paid it. A debit pays one thing — a
 * movement already explained by an invoice or another expense is refused —
 * and an expense is paid once, so linking it again moves the link. Under
 * the account's row lock, the one every bank writer takes.
 */
class LinkExpenseBankMovement
{
    /**
     * @throws ValidationException
     */
    public function handle(Expense $expense, LinkExpenseBankMovementData $data): void
    {
        DB::transaction(function () use ($expense, $data): void {
            $user = User::lockRow($expense->user_id);
            $movement = $user->bankMovements()->find($data->bankMovementId);

            if (! $movement instanceof BankMovement || $movement->isCredit()) {
                throw ValidationException::withMessages(['bankMovementId' => __('expenses.unknown_movement')]);
            }

            abort_if($movement->invoice_id !== null || ($movement->expense_id !== null && $movement->expense_id !== $expense->id), 409, __('expenses.movement_taken'));

            $expense->bankMovement()->update(['expense_id' => null]);
            $movement->update(['expense_id' => $expense->id]);
        });
    }
}
