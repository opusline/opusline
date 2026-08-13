<?php

declare(strict_types=1);

namespace App\Domain\Shared\Validation;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class InvoiceNumberFormat implements ValidationRule
{
    public const string COUNTER_TOKEN = 'NNN';

    public const string YEAR_TOKEN = 'AAAA';

    public const string MONTH_TOKEN = 'MM';

    /**
     * A run of one or more tokens, bounded by anything that is not a letter or digit.
     *
     * Tokens may sit against each other — "AAAAMM-NNN" is a run of two and renders
     * "202608-001" — but a token welded to literal text is not a token at all, so the
     * MM inside "COMMANDE" stays literal. Whoever renders a format must split it with
     * this pattern, or the preview and the issued number disagree.
     */
    public const string TOKEN_RUN_PATTERN = '/(?<![A-Za-z0-9])((?:AAAA|MM|NNN)+)(?![A-Za-z0-9])/';

    /** Splits a run into its individual tokens. */
    public const string TOKEN_PATTERN = '/AAAA|MM|NNN/';

    private const string MESSAGE = 'Le format doit contenir un seul compteur NNN et n\'accepter que les jetons AAAA, MM et NNN.';

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || ! $this->hasSingleCounter($value)) {
            $fail(self::MESSAGE);

            return;
        }

        $literals = preg_replace(self::TOKEN_RUN_PATTERN, '', $value) ?? '';

        if (preg_match('/^[A-Za-z0-9\-\/_. ]*$/', $literals) !== 1) {
            $fail(self::MESSAGE);
        }
    }

    /**
     * Exactly one, not at least one: a second counter has nowhere to go — the
     * renderer fills the first and would emit the rest as literal text.
     */
    private function hasSingleCounter(string $format): bool
    {
        preg_match_all(self::TOKEN_RUN_PATTERN, $format, $runs);

        $counters = 0;

        foreach ($runs[1] as $run) {
            preg_match_all(self::TOKEN_PATTERN, $run, $tokens);

            $counters += count(array_keys($tokens[0], self::COUNTER_TOKEN, strict: true));
        }

        return $counters === 1;
    }
}
