<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Data\BankImportData;
use App\Domain\Bank\Data\ImportBankStatementData;
use App\Domain\Bank\Parsing\ParseBankStatement;
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
    public function __construct(
        private readonly ParseBankStatement $parseBankStatement,
        private readonly RecordBankMovements $recordBankMovements,
        private readonly SummarizeBankAccount $summarizeBankAccount,
    ) {}

    public function handle(User $user, ImportBankStatementData $data): BankImportData
    {
        try {
            [$parsed, $format] = $this->parseBankStatement->handle((string) $data->file->get());
        } catch (StatementParseException $exception) {
            throw ValidationException::withMessages(['file' => __($exception->getMessage())]);
        }

        $recorded = DB::transaction(function () use ($user, $data, $parsed, $format): array {
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
                'closing_balance_cents' => $this->cents($parsed->closingBalanceCents, $settings),
                'closing_balance_on' => $parsed->closingBalanceOn ?? $parsed->periodEnd,
            ]);

            // A balance typed here is the same fact as one typed with the
            // pencil, read at the statement's date: it becomes the account's
            // anchor, which a file's own closing balance never overrides.
            if ($data->balanceAmount !== null) {
                $settings->update([
                    'bank_balance_cents' => $this->cents($data->balanceAmount, $settings),
                    'bank_balance_recorded_on' => $parsed->periodEnd,
                ]);
            }

            return $this->recordBankMovements->handle($locked, $statement, $parsed->movements, $statement->period_start);
        });

        return new BankImportData(
            lineCount: count($parsed->movements),
            importedCount: $recorded['imported'],
            suggestionCount: $recorded['suggestions'],
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
}
