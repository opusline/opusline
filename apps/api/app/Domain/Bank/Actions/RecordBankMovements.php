<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Enums\BankStatementFormat;
use App\Domain\Bank\Models\BankStatement;
use App\Domain\Bank\Parsing\ParsedMovement;
use App\Domain\Expenses\Actions\SuggestExpenseMatches;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

/**
 * Writes a batch of movements under a statement and raises the
 * reconciliation suggestions they make possible.
 *
 * A day's movements come from one source only: statement files, or the bank
 * connection. Files hash their rows by content and the bank by its own
 * references, so neither can recognize a movement the other brought in — a
 * day the other source already holds is skipped rather than doubled.
 *
 * Runs inside the caller's transaction, after User::lockRow(), with the
 * settings relation set on $locked.
 */
class RecordBankMovements
{
    public const int INSERT_CHUNK = 500;

    public function __construct(
        private readonly SuggestBankMatches $suggestBankMatches,
        private readonly SuggestExpenseMatches $suggestExpenseMatches,
    ) {}

    /**
     * @param  list<ParsedMovement>  $movements
     * @param  CarbonImmutable  $windowStart  the earliest day this batch covers — suggestions are re-evaluated from there
     * @return array{imported: int, suggestions: int}
     */
    public function handle(User $locked, BankStatement $statement, array $movements, CarbonImmutable $windowStart): array
    {
        $currency = $locked->settingsOrFail()->currency->value;
        $movements = $this->withoutDaysOfTheOtherSource($locked, $statement, $movements);
        $hashes = $this->dedupHashes($movements);

        $alreadyImported = [];

        // Chunked like the insert below: one IN list per chunk keeps the
        // lookup far from any driver's bind-parameter ceiling.
        foreach (array_chunk($hashes, self::INSERT_CHUNK) as $chunk) {
            /** @var list<string> $existingHashes */
            $existingHashes = $locked->bankMovements()
                ->whereIn('dedup_hash', $chunk)
                ->pluck('dedup_hash')
                ->all();
            $alreadyImported += array_flip($existingHashes);
        }

        // Bulk-inserted in chunks rather than one create() per row: a first
        // import carries years of history, and N round trips under the user
        // row lock can outlive Octane's max_execution_time. Raw rows, so the
        // casts don't apply — cents and date strings are written directly.
        $now = now();
        $rows = [];

        foreach ($movements as $index => $movement) {
            if (isset($alreadyImported[$hashes[$index]])) {
                continue;
            }

            // A bank that repeats a transaction across two pages would
            // otherwise hit the unique index with its second copy.
            $alreadyImported[$hashes[$index]] = true;

            $rows[] = [
                'user_id' => $locked->id,
                'bank_statement_id' => $statement->id,
                'booked_on' => $movement->bookedOn->toDateString(),
                'label' => mb_strcut($movement->label, 0, 255),
                'currency' => $currency,
                'amount_cents' => $movement->amountCents,
                'dedup_hash' => $hashes[$index],
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        foreach (array_chunk($rows, self::INSERT_CHUNK) as $chunk) {
            $locked->bankMovements()->insert($chunk);
        }

        // Every movement of the window still awaiting a suggestion is
        // re-evaluated, not just the new rows: an invoice sent after an
        // earlier import becomes matchable simply by re-importing the
        // statement that carries its payment. The window stops there —
        // cross-matching the whole account in PHP is the very shape the
        // chunked insert above exists to avoid, and it would run inside the
        // same user row lock.
        $rescanFrom = $windowStart->subDays(SuggestExpenseMatches::DAYS_APART);
        $suggestible = array_values($locked->bankMovements()
            ->where('amount_cents', '>', 0)
            ->whereNull('invoice_id')
            ->whereDoesntHave('match')
            ->where('booked_on', '>=', $rescanFrom->toDateString())
            ->get()
            ->all());
        $this->suggestExpenseMatches->handle($locked, $rescanFrom);

        return [
            'imported' => count($rows),
            'suggestions' => $this->suggestBankMatches->handle($locked, $suggestible),
        ];
    }

    /**
     * @param  list<ParsedMovement>  $movements
     * @return list<ParsedMovement>
     */
    private function withoutDaysOfTheOtherSource(User $locked, BankStatement $statement, array $movements): array
    {
        if ($movements === []) {
            return [];
        }

        $otherSourceStatementIds = $locked->bankStatements()
            ->where('format', $statement->format === BankStatementFormat::EnableBanking ? '!=' : '=', BankStatementFormat::EnableBanking)
            ->pluck('id');

        if ($otherSourceStatementIds->isEmpty()) {
            return $movements;
        }

        $days = array_map(static fn (ParsedMovement $movement): string => $movement->bookedOn->toDateString(), $movements);

        $takenDays = [];

        // pluck() hydrates through the CalendarDate cast.
        foreach ($locked->bankMovements()
            ->whereIn('bank_statement_id', $otherSourceStatementIds)
            ->whereBetween('booked_on', [min($days), max($days)])
            ->distinct()
            ->pluck('booked_on') as $day) {
            if ($day instanceof CarbonImmutable) {
                $takenDays[$day->toDateString()] = true;
            }
        }

        return array_values(array_filter(
            $movements,
            static fn (ParsedMovement $movement): bool => ! isset($takenDays[$movement->bookedOn->toDateString()]),
        ));
    }

    /**
     * One hash per movement, aligned by index. A bank's own transaction
     * reference is its idempotency key; everything else falls back to the
     * row's content plus its ordinal among identical rows in this batch, so
     * two genuine same-day same-amount payments stay two movements while
     * overlapping batches still collapse.
     *
     * @param  list<ParsedMovement>  $movements
     * @return list<string>
     */
    private function dedupHashes(array $movements): array
    {
        $occurrences = [];

        return array_map(function (ParsedMovement $movement) use (&$occurrences): string {
            if ($movement->fitid !== null) {
                return hash('sha256', 'fitid|'.$movement->fitid);
            }

            $row = implode('|', [
                $movement->bookedOn->toDateString(),
                (string) $movement->amountCents,
                NormalizeBankText::normalize($movement->label),
            ]);

            $occurrences[$row] = ($occurrences[$row] ?? 0) + 1;

            return hash('sha256', 'row|'.$row.'|'.$occurrences[$row]);
        }, $movements);
    }
}
