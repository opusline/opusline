<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Data\BankBalanceData;
use App\Domain\Bank\Enums\BankBalanceSource;
use App\Domain\Bank\Models\BankAccount;
use App\Domain\Bank\Models\BankStatement;
use App\Domain\Shared\Data\SignedMoneyData;
use App\Domain\Users\Models\User;
use Cknow\Money\Money;
use Illuminate\Support\Collection;

/**
 * Every bank account's balance, and the total the screens show. Each account
 * anchors on its own typed balance or statements (ResolveBankBalance): one
 * account's statement says nothing about another's.
 *
 * @phpstan-import-type BalanceAnchor from ResolveBankBalance
 *
 * @phpstan-type AccountBalance array{account: BankAccount, anchor: ?BalanceAnchor, balance: ?BankBalanceData}
 */
class ResolveAccountBalances
{
    public function __construct(
        private readonly ResolveBankBalance $resolveBankBalance,
        private readonly ResolveCurrentBalance $resolveCurrentBalance,
    ) {}

    /**
     * @param  Collection<int, BankStatement>  $statements  every statement of $user
     * @return list<AccountBalance> oldest account first
     */
    public function handle(User $user, Collection $statements): array
    {
        $currency = $user->settingsOrFail()->currency->value;
        $balances = [];

        foreach ($user->bankAccounts()->orderBy('id')->get() as $account) {
            $anchor = $this->resolveBankBalance->handle(
                $account,
                $statements->where('bank_account_id', $account->id),
            );

            $balances[] = [
                'account' => $account,
                'anchor' => $anchor,
                'balance' => $this->resolveCurrentBalance->handle($account, $anchor, $currency),
            ];
        }

        return $balances;
    }

    /**
     * The sum of the accounts that have a balance; null while none has.
     *
     * With several, the total is only as firm as its weakest part: derived as
     * soon as one account is, otherwise cited at the oldest figure it adds up.
     *
     * @param  list<AccountBalance>  $accountBalances
     */
    public static function total(array $accountBalances, string $currency): ?BankBalanceData
    {
        $known = array_values(array_filter(array_column($accountBalances, 'balance')));

        if ($known === []) {
            return null;
        }

        if (count($known) === 1) {
            return $known[0];
        }

        $cents = array_sum(array_map(static fn (BankBalanceData $balance): int => $balance->amount->amount, $known));
        $amount = SignedMoneyData::fromMoney(new Money($cents, $currency));

        $isAnyDerived = array_any($known, static fn (BankBalanceData $balance): bool => $balance->source === BankBalanceSource::Derived);

        if ($isAnyDerived) {
            return new BankBalanceData(amount: $amount, source: BankBalanceSource::Derived, asOf: null);
        }

        usort($known, static fn (BankBalanceData $a, BankBalanceData $b): int => $a->asOf <=> $b->asOf);

        return new BankBalanceData(amount: $amount, source: $known[0]->source, asOf: $known[0]->asOf);
    }
}
