<?php

declare(strict_types=1);

namespace App\Domain\Shared\Validation;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use LogicException;

/**
 * `before_or_equal:today`, with "today" read in the account's timezone.
 *
 * The framework rule resolves `today` in app time (UTC), which rejects a French
 * user's own date for the first hours of every day — the wrong URSSAF/TVA period
 * on a cash basis. Values are `Y-m-d` strings, so the comparison is lexical.
 */
class BeforeOrEqualAccountToday implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value)) {
            $fail('validation.date')->translate();

            return;
        }

        $user = auth()->user();

        // No silent UTC fallback: resolving "today" without an account would
        // reinstate the exact wrong-timezone bug this rule exists to fix.
        if ($user === null) {
            throw new LogicException('BeforeOrEqualAccountToday needs an authenticated user to resolve the account today.');
        }

        $today = $user->settingsOrFail()->today();

        if ($value > $today->format('Y-m-d')) {
            $fail('validation.before_or_equal')->translate(['date' => $today->format('Y-m-d')]);
        }
    }
}
