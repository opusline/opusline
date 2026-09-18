<?php

declare(strict_types=1);

namespace App\Domain\Bank\EnableBanking;

use App\Domain\Bank\Enums\BankSyncError;
use App\Domain\Bank\Parsing\ParseBankStatement;
use App\Domain\Bank\Parsing\ParsedMovement;
use App\Domain\Bank\Parsing\StatementDate;
use App\Domain\Bank\Parsing\StatementLabel;
use App\Domain\Bank\Parsing\StatementParseException;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;

/**
 * Reads Enable Banking's transactions and balances as a statement would be
 * read: signed cents, a calendar day, a label, and the bank's own reference.
 * Anything it cannot read exactly fails the whole sync — a movement silently
 * dropped or mis-signed would skew the balance without anyone noticing.
 */
final class EnableBankingStatement
{
    /**
     * Booked balance types only, closing before interim: the available ones
     * count pending card payments or the overdraft, which the roll-forward of
     * booked movements would then count a second time.
     */
    private const array BOOKED_BALANCE_TYPES = ['CLBD', 'ITBD'];

    /** Enable Banking's statuses for what never reached the books, or not yet. */
    private const array UNBOOKED_STATUSES = ['PDNG', 'HOLD', 'SCHD', 'CNCL', 'RJCT'];

    /**
     * @param  list<array<array-key, mixed>>  $transactions
     * @param  string  $accountIdentificationHash  scopes the bank's references, which are only unique per account
     * @return list<ParsedMovement> oldest first
     *
     * @throws BankSyncFailed
     */
    public static function movements(array $transactions, string $accountCurrency, string $accountIdentificationHash): array
    {
        $movements = [];

        foreach ($transactions as $transaction) {
            $status = $transaction['status'] ?? null;

            // The fetch asks for booked ones only; a bank ignoring the filter
            // must not slip in a pending card payment that may never book.
            if (in_array($status, self::UNBOOKED_STATUSES, strict: true)) {
                continue;
            }

            if ($status !== 'BOOK') {
                throw self::unreadable('a transaction status');
            }

            $movements[] = self::movement($transaction, $accountCurrency, $accountIdentificationHash);
        }

        return $movements === [] ? [] : ParseBankStatement::chronological($movements);
    }

    /**
     * The account's booked balance as the bank states it, and the day it
     * closes. A balance with no reference date is left out: dated on the sync
     * day, it would pass for that day's close and hide the day's movements
     * from the roll-forward.
     *
     * @param  list<array<array-key, mixed>>  $balances
     * @return ?array{cents: int, on: CarbonImmutable}
     *
     * @throws BankSyncFailed
     */
    public static function closingBalance(array $balances, string $accountCurrency): ?array
    {
        foreach (self::BOOKED_BALANCE_TYPES as $type) {
            foreach ($balances as $balance) {
                $referenceDate = $balance['reference_date'] ?? null;

                if (($balance['balance_type'] ?? null) !== $type || ! is_string($referenceDate)) {
                    continue;
                }

                return [
                    'cents' => self::amount($balance['balance_amount'] ?? null, $accountCurrency),
                    'on' => self::date($referenceDate),
                ];
            }
        }

        return null;
    }

    /**
     * @param  array<array-key, mixed>  $transaction
     *
     * @throws BankSyncFailed
     */
    private static function movement(array $transaction, string $accountCurrency, string $accountIdentificationHash): ParsedMovement
    {
        $magnitude = abs(self::amount($transaction['transaction_amount'] ?? null, $accountCurrency));

        $amountCents = match ($transaction['credit_debit_indicator'] ?? null) {
            'CRDT' => $magnitude,
            'DBIT' => -$magnitude,
            default => throw self::unreadable('a transaction without a credit/debit indicator'),
        };

        $day = EnableBankingFields::firstString($transaction, ['booking_date', 'value_date', 'transaction_date'])
            ?? throw self::unreadable('a transaction without a date');

        // Never transaction_id: Enable Banking warns it may change from one
        // fetch to the next, and the overlap between syncs would duplicate rows.
        $entryReference = EnableBankingFields::firstString($transaction, ['entry_reference']);

        return new ParsedMovement(
            bookedOn: self::date($day),
            label: self::label($transaction, $amountCents > 0),
            amountCents: $amountCents,
            fitid: $entryReference === null ? null : $accountIdentificationHash.'|'.$entryReference,
        );
    }

    /**
     * Who paid or was paid, then what the payment says — the invoice number a
     * client typed, the URSSAF reference — which is what reconciliation and
     * the fiscal debit detection read.
     *
     * @param  array<array-key, mixed>  $transaction
     */
    private static function label(array $transaction, bool $isCredit): string
    {
        $party = $transaction[$isCredit ? 'debtor' : 'creditor'] ?? null;
        $counterparty = is_array($party) ? EnableBankingFields::firstString($party, ['name']) : null;

        $remittanceLines = $transaction['remittance_information'] ?? null;
        $remittance = is_array($remittanceLines)
            ? self::collapse(implode(' ', array_filter($remittanceLines, is_string(...))))
            : null;

        if ($counterparty !== null && $remittance !== null && mb_stripos($remittance, $counterparty) !== false) {
            $counterparty = null;
        }

        $code = $transaction['bank_transaction_code'] ?? null;
        $label = StatementLabel::compose($counterparty, $remittance);

        if ($label === '' && is_array($code)) {
            $label = EnableBankingFields::firstString($code, ['description']) ?? '';
        }

        return $label === '' ? '-' : $label;
    }

    /**
     * Signed cents of an amount object, in the account currency only.
     *
     * @throws BankSyncFailed
     */
    private static function amount(mixed $amount, string $accountCurrency): int
    {
        if (! is_array($amount) || ! is_string($amount['amount'] ?? null)) {
            throw self::unreadable('an amount');
        }

        if (($amount['currency'] ?? null) !== $accountCurrency) {
            throw new BankSyncFailed(BankSyncError::CurrencyMismatch, 'Enable Banking reported an amount in another currency than the account.');
        }

        return self::cents($amount['amount']);
    }

    /**
     * A dot-decimal string as cents. Stricter than the statement parsers'
     * amount reader on purpose: "1.500" is one and a half here, never fifteen
     * hundred, and a third decimal that is not zero is refused, not rounded.
     *
     * @throws BankSyncFailed
     */
    private static function cents(string $amount): int
    {
        if (preg_match('/^(-?)(\d{1,15})(?:\.(\d+))?$/', trim($amount), $parts) !== 1) {
            throw self::unreadable('an amount');
        }

        $decimals = $parts[3] ?? '';

        if (strlen($decimals) > 2 && trim(substr($decimals, 2), '0') !== '') {
            throw self::unreadable('an amount below the cent');
        }

        $cents = (int) $parts[2] * 100 + (int) str_pad(substr($decimals, 0, 2), 2, '0');

        return $parts[1] === '-' ? -$cents : $cents;
    }

    /**
     * @throws BankSyncFailed
     */
    private static function date(string $value): CarbonImmutable
    {
        if (preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $value, $parts) !== 1) {
            throw self::unreadable('a date');
        }

        try {
            return StatementDate::fromParts((int) $parts[1], (int) $parts[2], (int) $parts[3]);
        } catch (StatementParseException $exception) {
            throw new BankSyncFailed(BankSyncError::Unavailable, 'Enable Banking returned a date that does not exist.', $exception);
        }
    }

    private static function collapse(string $text): ?string
    {
        $collapsed = Str::squish($text);

        return $collapsed === '' ? null : $collapsed;
    }

    private static function unreadable(string $what): BankSyncFailed
    {
        return new BankSyncFailed(BankSyncError::Unavailable, "Enable Banking returned {$what} that could not be read.");
    }
}
