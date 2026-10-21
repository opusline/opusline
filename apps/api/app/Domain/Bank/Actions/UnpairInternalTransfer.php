<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Models\BankMovement;
use App\Domain\Expenses\Actions\SuggestExpenseMatches;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Undoes a pairing PairInternalTransfers got wrong: both movements go back to
 * being a payment and an expense like any other, and are never paired again.
 * Their reconciliation suggestions are raised again on the spot, so the credit
 * can meet its invoice and the debit its expense without waiting for a sync.
 */
class UnpairInternalTransfer
{
    public function __construct(
        private readonly SuggestBankMatches $suggestBankMatches,
        private readonly SuggestExpenseMatches $suggestExpenseMatches,
    ) {}

    public function handle(User $user, BankMovement $movement): void
    {
        DB::transaction(function () use ($user, $movement): void {
            $locked = User::lockRow($user->id);
            $locked->setRelation('settings', $locked->settings()->sole());
            $movement = $locked->bankMovements()->whereKey($movement->id)->sole();

            abort_if($movement->transfer_counterpart_id === null, 409, __('bank.transfer_not_paired'));

            $pair = $locked->bankMovements()
                ->whereKey([$movement->id, $movement->transfer_counterpart_id])
                ->get();

            $locked->bankMovements()->whereKey($pair->modelKeys())->update([
                'transfer_counterpart_id' => null,
                'transfer_pairing_refused' => true,
            ]);

            $debit = $pair->first(static fn (BankMovement $side): bool => ! $side->isCredit());
            $credits = $locked->bankMovements()
                ->whereKey($pair->modelKeys())
                ->where('amount_cents', '>', 0)
                ->whereNull('invoice_id')
                ->whereDoesntHave('match')
                ->get();

            $this->suggestBankMatches->handle($locked, array_values($credits->all()));

            if ($debit instanceof BankMovement) {
                $this->suggestExpenseMatches->handle($locked, $debit->booked_on);
            }
        });
    }
}
