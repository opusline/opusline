<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Data\BankMovementData;
use App\Domain\Bank\Models\BankMovement;
use App\Domain\Shared\Database\DatePageCursor;
use App\Domain\Users\Models\User;
use Cknow\Money\Money;

/**
 * One page of the movement table, newest first, each row carrying its running
 * balance. The history is windowed — `bank_movements` is the account's
 * fastest-growing table, and hydrating all of it on every read and write of
 * the Compte pro screen is the cost this bounds.
 *
 * @phpstan-import-type BalanceAnchor from ResolveBankBalance
 */
class ListBankMovements
{
    public const int PAGE_SIZE = 200;

    public function __construct(
        private readonly ResolveBankBalance $resolveBankBalance,
        private readonly ResolveCurrentBalance $resolveCurrentBalance,
    ) {}

    /**
     * The paginated endpoint's entry point: resolves the account's balance
     * before reading the page. SummarizeBankAccount calls page() directly with
     * the figures it already holds.
     *
     * @return array{movements: list<BankMovementData>, nextCursor: ?string}
     */
    public function handle(User $user, ?string $cursor): array
    {
        $currency = $user->settingsOrFail()->currency->value;
        $anchor = $this->resolveBankBalance->handle($user, $user->bankStatements()->get());
        $balance = $this->resolveCurrentBalance->handle($user, $anchor, $currency);

        return $this->page($user, $balance?->amount->amount, $currency, $cursor);
    }

    /**
     * @return array{movements: list<BankMovementData>, nextCursor: ?string}
     */
    public function page(User $user, ?int $currentBalanceCents, string $currency, ?string $cursor): array
    {
        $position = DatePageCursor::decode($cursor);

        /** @var list<BankMovement> $movements */
        [$movements, $nextCursor] = DatePageCursor::window(
            $user->bankMovements()->with(['invoice', 'match']),
            'booked_on',
            self::PAGE_SIZE,
            $position,
        );

        $balances = self::runningBalances(
            $this->balanceAfterNewestOnPage($user, $currentBalanceCents, $movements, $position),
            array_map(static fn (BankMovement $movement): int => (int) $movement->amount_cents->getAmount(), $movements),
        );

        $rows = [];

        foreach ($movements as $index => $movement) {
            $cents = $balances[$index];
            $rows[] = BankMovementData::fromModel($movement, $cents === null ? null : new Money($cents, $currency));
        }

        return ['movements' => $rows, 'nextCursor' => $nextCursor];
    }

    /**
     * The balance behind each row of one newest-first page, walked backwards
     * from the balance after the page's newest movement: the balance after a
     * movement is the balance after the next-newer one minus that newer
     * amount. One seed reaches any page, on either side of the anchor date.
     *
     * @param  list<int>  $signedCents  newest first
     * @return list<?int> aligned with $signedCents; all null without a balance
     */
    public static function runningBalances(?int $balanceAfterNewestCents, array $signedCents): array
    {
        if ($balanceAfterNewestCents === null) {
            return array_fill(0, count($signedCents), null);
        }

        $balances = [];
        $balance = $balanceAfterNewestCents;

        foreach ($signedCents as $cents) {
            $balances[] = $balance;
            $balance -= $cents;
        }

        return $balances;
    }

    /**
     * The walk's seed. The first page starts at the account's current balance;
     * a deeper page starts at that figure less every movement newer than the
     * page — one indexed SUM instead of hydrating the rows above it.
     *
     * @param  list<BankMovement>  $movements
     */
    private function balanceAfterNewestOnPage(
        User $user,
        ?int $currentBalanceCents,
        array $movements,
        ?DatePageCursor $position,
    ): ?int {
        if ($currentBalanceCents === null || $movements === []) {
            return null;
        }

        if (! $position instanceof DatePageCursor) {
            return $currentBalanceCents;
        }

        $newest = $movements[0];
        $newerRows = $user->bankMovements();
        new DatePageCursor($newest->booked_on->toDateString(), $newest->id)
            ->filterNewerRows($newerRows, 'booked_on');

        return $currentBalanceCents - (int) $newerRows->sum('amount_cents');
    }
}
