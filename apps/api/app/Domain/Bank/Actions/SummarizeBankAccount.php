<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Data\BankAccountData;
use App\Domain\Bank\Data\BankMatchData;
use App\Domain\Bank\Data\BankMovementData;
use App\Domain\Bank\Data\BankStatementData;
use App\Domain\Bank\Enums\BankMatchStatus;
use App\Domain\Bank\Models\BankMatch;
use App\Domain\Bank\Models\BankMovement;
use App\Domain\Bank\Models\BankStatement;
use App\Domain\Users\Models\User;
use Cknow\Money\Money;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class SummarizeBankAccount
{
    public function __construct(
        private readonly ResolveBankBalance $resolveBankBalance,
        private readonly ComputeBankProvisions $computeBankProvisions,
        private readonly ResolveCurrentBalance $resolveCurrentBalance,
    ) {}

    public function handle(User $user): BankAccountData
    {
        // The mutating endpoints answer with this summary, and the settings
        // relation was cached before the write (SetLocale loads it on every
        // request) — reload it so the answer reflects what was just written.
        $user->load('settings');

        $currency = $user->settingsOrFail()->currency->value;

        $movements = $user->bankMovements()
            ->with(['invoice', 'match'])
            ->orderByDesc('booked_on')
            ->orderByDesc('id')
            ->get();

        $statements = $user->bankStatements()
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->get();

        $anchor = $this->resolveBankBalance->handle($user, $statements, $movements);
        ['balance' => $balance, 'runningBalances' => $runningBalances] = $this->resolveCurrentBalance
            ->handle($anchor, $movements, $currency);

        return new BankAccountData(
            balance: $balance,
            provisions: $this->computeBankProvisions->handle($user, $movements),
            pendingMatches: $this->pendingMatches($user, $movements),
            movements: array_values($movements
                ->map(function (BankMovement $movement, int $index) use ($runningBalances, $currency): BankMovementData {
                    $cents = $runningBalances[$index];

                    return BankMovementData::fromModel($movement, $cents === null ? null : new Money($cents, $currency));
                })
                ->all()),
            statements: $this->statements($user, $statements),
        );
    }

    /**
     * Assembled from the already-loaded movements — each pending match rides
     * on its movement; only the suggested invoices need their own fetch.
     *
     * @param  Collection<int, BankMovement>  $movements
     * @return list<BankMatchData>
     */
    private function pendingMatches(User $user, Collection $movements): array
    {
        $pending = $movements
            ->map(static function (BankMovement $movement): ?BankMatch {
                $match = $movement->match;

                if ($match === null || $match->status !== BankMatchStatus::Pending) {
                    return null;
                }

                return $match->setRelation('movement', $movement);
            })
            ->filter()
            ->values();

        if ($pending->isEmpty()) {
            return [];
        }

        $invoices = $user->invoices()
            ->with('client')
            ->findMany($pending->pluck('invoice_id'))
            ->keyBy('id');

        $ordered = $pending
            ->each(static fn (BankMatch $match) => $match->setRelation('invoice', $invoices->get($match->invoice_id)))
            ->sortBy([
                static fn (BankMatch $a, BankMatch $b): int => $b->movement->booked_on->getTimestamp() <=> $a->movement->booked_on->getTimestamp(),
                static fn (BankMatch $a, BankMatch $b): int => $b->id <=> $a->id,
            ])
            ->values();

        return array_values(BankMatchData::collect($ordered->all(), 'array'));
    }

    /**
     * @param  Collection<int, BankStatement>  $statements  newest first
     * @return list<BankStatementData>
     */
    private function statements(User $user, Collection $statements): array
    {
        // One grouped aggregate instead of hydrating the whole match history:
        // this runs on every summary, and only two integers per statement are
        // needed.
        /** @var Collection<int, object{statement_id: int|string, total: int|string, validated: int|string|null}> $counters */
        $counters = DB::table('bank_matches')
            ->join('bank_movements', 'bank_movements.id', '=', 'bank_matches.bank_movement_id')
            ->where('bank_matches.user_id', $user->id)
            ->groupBy('bank_movements.bank_statement_id')
            ->selectRaw(
                'bank_movements.bank_statement_id as statement_id, count(*) as total, sum(case when bank_matches.status = ? then 1 else 0 end) as validated',
                [BankMatchStatus::Validated->value],
            )
            ->get();

        $totals = [];
        $validated = [];

        foreach ($counters as $counter) {
            $totals[(int) $counter->statement_id] = (int) $counter->total;
            $validated[(int) $counter->statement_id] = (int) ($counter->validated ?? 0);
        }

        return array_values($statements
            ->map(static fn (BankStatement $statement): BankStatementData => BankStatementData::fromModel(
                $statement,
                matchCount: $totals[$statement->id] ?? 0,
                validatedMatchCount: $validated[$statement->id] ?? 0,
            ))
            ->all());
    }
}
