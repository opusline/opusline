<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Enums\BankBalanceSource;
use App\Domain\Bank\Models\BankMovement;
use App\Domain\Bank\Models\BankStatement;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

/**
 * Picks the account's balance anchor: the hand-typed figure or the newest
 * statement closing balance, whichever speaks about the later date. On a tie
 * the typed figure wins — typing it was a deliberate correction.
 *
 * With no anchor at all but movements on file, the balance derives from the
 * movements alone, as if the account had opened empty just before the first
 * one — exact once the full history is imported, corrected with the pencil
 * otherwise.
 *
 * Beyond the figure, the anchor carries what it is authoritative for, because
 * this is the only place that knows how each one was obtained:
 *
 * - `coversThrough` — the last day it provably accounts for. A statement
 *   closing balance is a day's *close*, so it covers its own day. A typed one
 *   is a snapshot from a moment inside the day, so it only covers the day
 *   before: the app invites the user to read their balance and then pay
 *   themselves, and treating that transfer as already known would overstate
 *   what is theirs.
 * - `citableAsOf` — the date to show the user, null for a derived balance,
 *   whose anchor date is an internal fiction that only seats the walk.
 *
 * Consumers read those instead of re-deriving them from the source, so a new
 * source is described once, here.
 *
 * @phpstan-type BalanceAnchor array{cents: int, source: BankBalanceSource, asOf: CarbonImmutable, coversThrough: CarbonImmutable, citableAsOf: ?CarbonImmutable}
 */
class ResolveBankBalance
{
    /**
     * @param  Collection<int, BankStatement>  $statements  every statement of $user
     * @param  Collection<int, BankMovement>  $movements  every movement of $user
     * @return ?BalanceAnchor
     */
    public function handle(User $user, Collection $statements, Collection $movements): ?array
    {
        $settings = $user->settingsOrFail();

        $manual = null;

        if ($settings->bank_balance_cents !== null && $settings->bank_balance_recorded_on !== null) {
            $manual = [
                'cents' => (int) $settings->bank_balance_cents->getAmount(),
                'source' => BankBalanceSource::Manual,
                'asOf' => $settings->bank_balance_recorded_on,
                'coversThrough' => $settings->bank_balance_recorded_on->subDay(),
                'citableAsOf' => $settings->bank_balance_recorded_on,
            ];
        }

        $statement = $this->statementAnchor($statements);

        if ($manual === null && $statement === null) {
            return $this->derived($movements);
        }

        if ($manual === null || $statement === null) {
            return $manual ?? $statement;
        }

        return $statement['asOf']->greaterThan($manual['asOf']) ? $statement : $manual;
    }

    /**
     * @param  Collection<int, BankStatement>  $statements
     * @return ?BalanceAnchor
     */
    private function statementAnchor(Collection $statements): ?array
    {
        $latestStatement = $statements
            ->filter(static fn (BankStatement $statement): bool => $statement->closing_balance_cents !== null
                && $statement->closing_balance_on !== null)
            ->sortBy([
                ['closing_balance_on', 'desc'],
                ['created_at', 'desc'],
                ['id', 'desc'],
            ])
            ->first();

        // The filter already guaranteed both fields; the property re-checks
        // only exist because static analysis cannot see through the closure.
        if ($latestStatement === null || $latestStatement->closing_balance_cents === null || $latestStatement->closing_balance_on === null) {
            return null;
        }

        return [
            'cents' => (int) $latestStatement->closing_balance_cents->getAmount(),
            'source' => BankBalanceSource::Statement,
            'asOf' => $latestStatement->closing_balance_on,
            'coversThrough' => $latestStatement->closing_balance_on,
            'citableAsOf' => $latestStatement->closing_balance_on,
        ];
    }

    /**
     * @param  Collection<int, BankMovement>  $movements
     * @return ?BalanceAnchor
     */
    private function derived(Collection $movements): ?array
    {
        $firstBookedOn = $movements->min('booked_on');

        if (! $firstBookedOn instanceof CarbonImmutable) {
            return null;
        }

        return [
            // The implied empty account: zero just before the first movement.
            // Rolling forward from it makes the shown balance Σ movements.
            'cents' => 0,
            'source' => BankBalanceSource::Derived,
            'asOf' => $firstBookedOn->subDay(),
            'coversThrough' => $firstBookedOn->subDay(),
            'citableAsOf' => null,
        ];
    }
}
