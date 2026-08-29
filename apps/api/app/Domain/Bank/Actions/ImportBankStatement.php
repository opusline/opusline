<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Data\BankImportData;
use App\Domain\Bank\Data\ImportBankStatementData;
use App\Domain\Bank\Parsing\ParseBankStatement;
use App\Domain\Bank\Parsing\ParsedMovement;
use App\Domain\Bank\Parsing\ParsedStatement;
use App\Domain\Bank\Parsing\StatementParseException;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Shared\Data\SignedMoneyData;
use App\Domain\Shared\Enums\Currency;
use App\Domain\Shared\Validation\AccountCurrency;
use App\Domain\Users\Models\User;
use Cknow\Money\Money;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * The import pipeline: parse strictly before any write, then — under the
 * account lock — record the statement, insert only the movements no earlier
 * import already brought in, and raise reconciliation suggestions for every
 * movement still awaiting one. The file itself is not kept: the rows and the
 * statement row are the import.
 */
class ImportBankStatement
{
    public const int INSERT_CHUNK = 500;

    public function __construct(
        private readonly ParseBankStatement $parseBankStatement,
        private readonly SuggestBankMatches $suggestBankMatches,
        private readonly SummarizeBankAccount $summarizeBankAccount,
    ) {}

    public function handle(User $user, ImportBankStatementData $data): BankImportData
    {
        try {
            [$parsed, $format] = $this->parseBankStatement->handle((string) $data->file->get());
        } catch (StatementParseException $exception) {
            throw ValidationException::withMessages(['file' => __($exception->getMessage())]);
        }

        [$importedCount, $suggestionCount] = DB::transaction(function () use ($user, $data, $parsed, $format): array {
            $locked = User::lockRow($user->id);
            $settings = $locked->settings()->sole();
            $locked->setRelation('settings', $settings);

            if ($parsed->currency !== null && $parsed->currency !== $settings->currency->value) {
                throw ValidationException::withMessages(['file' => __('bank.statement_currency_mismatch')]);
            }

            // Request validation checked the currency before the lock existed;
            // re-checking inside closes the window a concurrent change opens.
            if ($data->balanceAmount !== null && $data->balanceCurrency instanceof Currency) {
                AccountCurrency::assertMatchesSettings(
                    $settings,
                    new SignedMoneyData($data->balanceAmount, $data->balanceCurrency),
                );
            }

            $statement = $locked->bankStatements()->create([
                'file_name' => $this->sanitizedFileName($data->file->getClientOriginalName()),
                'format' => $format,
                'period_start' => $parsed->periodStart,
                'period_end' => $parsed->periodEnd,
                'line_count' => count($parsed->movements),
                'currency' => $settings->currency->value,
                'closing_balance_cents' => $this->cents($data->balanceAmount ?? $parsed->closingBalanceCents, $settings),
                'closing_balance_on' => $data->balanceAmount !== null
                    ? $parsed->periodEnd
                    : ($parsed->closingBalanceOn ?? $parsed->periodEnd),
            ]);

            $hashes = $this->dedupHashes($parsed);

            /** @var list<string> $existingHashes */
            $existingHashes = $locked->bankMovements()
                ->whereIn('dedup_hash', $hashes)
                ->pluck('dedup_hash')
                ->all();
            $alreadyImported = array_flip($existingHashes);

            // Bulk-inserted in chunks rather than one create() per row: a first
            // import carries years of history, and N round trips under the user
            // row lock can outlive Octane's max_execution_time. Raw rows, so the
            // casts don't apply — cents and date strings are written directly.
            $now = now();
            $rows = [];

            foreach ($parsed->movements as $index => $movement) {
                if (isset($alreadyImported[$hashes[$index]])) {
                    continue;
                }

                $rows[] = [
                    'user_id' => $locked->id,
                    'bank_statement_id' => $statement->id,
                    'booked_on' => $movement->bookedOn->toDateString(),
                    'label' => mb_strcut($movement->label, 0, 255),
                    'currency' => $settings->currency->value,
                    'amount_cents' => $movement->amountCents,
                    'dedup_hash' => $hashes[$index],
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            foreach (array_chunk($rows, self::INSERT_CHUNK) as $chunk) {
                $locked->bankMovements()->insert($chunk);
            }

            $importedCount = count($rows);

            // Every movement still awaiting a suggestion is re-evaluated, not
            // just the new rows: an invoice sent after an earlier import
            // becomes matchable simply by re-importing the statement.
            $suggestible = array_values($locked->bankMovements()
                ->where('amount_cents', '>', 0)
                ->whereNull('invoice_id')
                ->whereDoesntHave('match')
                ->get()
                ->all());

            return [$importedCount, $this->suggestBankMatches->handle($locked, $suggestible)];
        });

        return new BankImportData(
            lineCount: count($parsed->movements),
            importedCount: $importedCount,
            suggestionCount: $suggestionCount,
            account: $this->summarizeBankAccount->handle($user),
        );
    }

    private function sanitizedFileName(string $original): string
    {
        $name = trim(basename(str_replace('\\', '/', $original)));

        return mb_strcut($name === '' ? 'releve' : $name, 0, 255);
    }

    /**
     * Minor units as a Money in the account's currency. Money::parse() reads a
     * bare int as minor units but a decimal-looking string as major ones, so the
     * cast is only ever handed the typed value.
     */
    private function cents(?int $cents, UserSettings $settings): ?Money
    {
        return $cents === null ? null : new Money($cents, $settings->currency->value);
    }

    /**
     * One hash per parsed movement, aligned by index. OFX/CAMT bank references
     * are the bank's own idempotency key; everything else falls back to the
     * row's content plus its ordinal among identical rows in this file, so two
     * genuine same-day same-amount payments stay two movements while
     * overlapping exports still collapse.
     *
     * @return list<string>
     */
    private function dedupHashes(ParsedStatement $parsed): array
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
        }, $parsed->movements);
    }
}
