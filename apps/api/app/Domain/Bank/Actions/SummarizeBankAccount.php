<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Data\BankAccountData;
use App\Domain\Bank\Data\BankMatchData;
use App\Domain\Bank\Data\BankStatementData;
use App\Domain\Bank\Enums\BankMatchStatus;
use App\Domain\Bank\Models\BankMatch;
use App\Domain\Bank\Models\BankStatement;
use App\Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Everything on the Compte pro screen. Aggregates and the first page of the
 * movement table only — the whole movement history is never hydrated here,
 * whatever the account's age; older pages come from ListBankMovements.
 */
class SummarizeBankAccount
{
    public function __construct(
        private readonly ResolveBankBalance $resolveBankBalance,
        private readonly ComputeBankProvisions $computeBankProvisions,
        private readonly ResolveCurrentBalance $resolveCurrentBalance,
        private readonly ListBankMovements $listBankMovements,
    ) {}

    public function handle(User $user): BankAccountData
    {
        // The mutating endpoints answer with this summary, and the settings
        // relation was cached before the write (SetLocale loads it on every
        // request) — reload it so the answer reflects what was just written.
        $user->load('settings');

        $currency = $user->settingsOrFail()->currency->value;

        $statements = $user->bankStatements()
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->get();

        $anchor = $this->resolveBankBalance->handle($user, $statements);
        $balance = $this->resolveCurrentBalance->handle($user, $anchor, $currency);

        ['movements' => $movements, 'nextCursor' => $nextMovementsCursor] = $this->listBankMovements
            ->page($user, $balance?->amount->amount, $currency, cursor: null);

        return new BankAccountData(
            balance: $balance,
            provisions: $this->computeBankProvisions->handle($user),
            pendingMatches: $this->pendingMatches($user),
            movements: $movements,
            nextMovementsCursor: $nextMovementsCursor,
            hasUnlinkedCredits: $this->hasUnlinkedCredits($user),
            statements: $this->statements($user, $statements),
        );
    }

    /**
     * A credit nobody linked: no invoice attached and no suggestion pending.
     * Answered by the database because the screen only holds a window of the
     * movements — the page must never claim « tout est rapproché » while an
     * older credit sits unlinked past the window.
     */
    private function hasUnlinkedCredits(User $user): bool
    {
        return $user->bankMovements()
            ->where('amount_cents', '>', 0)
            ->whereNull('invoice_id')
            ->whereDoesntHave('match', function (Builder $query): void {
                $query->where('status', BankMatchStatus::Pending);
            })
            ->exists();
    }

    /**
     * @return list<BankMatchData>
     */
    private function pendingMatches(User $user): array
    {
        $pending = $user->bankMatches()
            ->where('status', BankMatchStatus::Pending)
            ->with(['movement', 'invoice.client'])
            ->get()
            ->sortBy([
                static fn (BankMatch $a, BankMatch $b): int => $b->movement->booked_on->getTimestamp() <=> $a->movement->booked_on->getTimestamp(),
                static fn (BankMatch $a, BankMatch $b): int => $b->id <=> $a->id,
            ])
            ->values();

        return array_values(BankMatchData::collect($pending->all(), 'array'));
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
