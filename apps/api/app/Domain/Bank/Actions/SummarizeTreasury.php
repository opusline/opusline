<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Data\BankBalanceData;
use App\Domain\Bank\Data\TreasuryData;
use App\Domain\Bank\Data\TreasuryTransferData;
use App\Domain\Bank\Models\TreasuryTransfer;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Data\SignedMoneyData;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Illuminate\Support\Collection;

/**
 * « Combien je peux me virer ? » — the account balance, less what the fisc is
 * still owed, less what has already left the account without the bank having
 * reported it yet.
 *
 * That last term is the subtle one. A transfer noted here is money gone in
 * reality but not in Opusline's figures, because the balance only advances when
 * a statement is imported. Ignoring it would offer the same euros twice;
 * booking it as a movement would double-count it the moment the statement
 * lands. So it is deducted only while the balance predates it, and settles
 * itself once a statement covering its date arrives.
 *
 * The balance and the provisions are read off SummarizeBankAccount rather than
 * recomputed: one anchor-and-roll-forward walk in the codebase, not two.
 */
class SummarizeTreasury
{
    public function __construct(
        private readonly SummarizeBankAccount $summarizeBankAccount,
    ) {}

    public function handle(User $user): TreasuryData
    {
        $account = $this->summarizeBankAccount->handle($user);
        $currency = $user->settingsOrFail()->currency->value;

        $transfers = $user->treasuryTransfers()
            ->orderByDesc('transferred_on')
            ->orderByDesc('id')
            ->get();

        $settledThrough = $account->balance?->asOf;
        $pending = $this->pendingTotal($transfers, $settledThrough, $currency);

        $balance = $account->balance instanceof BankBalanceData
            ? new Money($account->balance->amount->amount, $currency)
            : new Money(0, $currency);

        $safe = $balance
            ->subtract($account->provisions->total->toMoney())
            ->subtract($pending);

        return new TreasuryData(
            balance: $account->balance,
            provisions: $account->provisions,
            transferable: MoneyData::fromMoney(
                $safe->isNegative() ? new Money(0, $currency) : $safe,
            ),
            shortfall: $safe->isNegative() ? SignedMoneyData::fromMoney($safe) : null,
            pendingTransfers: MoneyData::fromMoney($pending),
            transfers: array_values($transfers
                ->map(fn (TreasuryTransfer $transfer): TreasuryTransferData => new TreasuryTransferData(
                    id: $transfer->id,
                    transferredOn: $transfer->transferred_on,
                    amount: MoneyData::fromMoney($transfer->amount_cents),
                    note: $transfer->note,
                    isSettled: $this->isSettled($transfer, $settledThrough),
                ))
                ->all()),
        );
    }

    /**
     * A transfer is settled once the balance is dated at or after it: the
     * statement that reported it has been imported, so the balance already
     * lost the money and deducting it again would understate what is safe.
     *
     * A balance with no date to cite (derived from movements alone) settles
     * nothing — under-reporting what you may move is the safe direction here.
     */
    private function isSettled(TreasuryTransfer $transfer, ?CarbonImmutable $settledThrough): bool
    {
        return $settledThrough instanceof CarbonImmutable
            && ! $transfer->transferred_on->greaterThan($settledThrough);
    }

    /**
     * @param  Collection<int, TreasuryTransfer>  $transfers
     */
    private function pendingTotal(Collection $transfers, ?CarbonImmutable $settledThrough, string $currency): Money
    {
        $total = new Money(0, $currency);

        foreach ($transfers as $transfer) {
            if (! $this->isSettled($transfer, $settledThrough)) {
                $total = $total->add($transfer->amount_cents);
            }
        }

        return $total;
    }
}
