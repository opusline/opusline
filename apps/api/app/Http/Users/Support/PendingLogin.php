<?php

declare(strict_types=1);

namespace App\Http\Users\Support;

use App\Domain\Users\Models\User;
use Illuminate\Contracts\Session\Session;

/**
 * The state between a correct password and a correct second factor. It lives
 * in the guest session as plain scalars, expires on its own, and is discarded
 * after a handful of wrong answers so the password has to be proven again.
 */
final class PendingLogin
{
    public const string KEY_USER_ID = 'login.id';

    public const string KEY_REMEMBER = 'login.remember';

    public const string KEY_EXPIRES_AT = 'login.expires_at';

    public const string KEY_FAILURES = 'login.failures';

    public const int TTL_SECONDS = 300;

    public const int MAX_FAILURES = 5;

    public static function start(Session $session, User $user, bool $remember): void
    {
        $session->put([
            self::KEY_USER_ID => $user->id,
            self::KEY_REMEMBER => $remember,
            self::KEY_EXPIRES_AT => now()->getTimestamp() + self::TTL_SECONDS,
            self::KEY_FAILURES => 0,
        ]);
    }

    public static function user(Session $session): ?User
    {
        $userId = $session->get(self::KEY_USER_ID);
        $expiresAt = $session->get(self::KEY_EXPIRES_AT);

        if (! is_int($userId) || ! is_int($expiresAt)) {
            return null;
        }

        if ($expiresAt <= now()->getTimestamp()) {
            self::clear($session);

            return null;
        }

        return User::query()->find($userId);
    }

    public static function remember(Session $session): bool
    {
        return $session->get(self::KEY_REMEMBER) === true;
    }

    /**
     * Counts a wrong answer. The one that exhausts the allowance discards
     * the pending login and answers 409 itself, so the caller never has to
     * tell the last miss from an already expired login: the password has to
     * be proven again either way.
     */
    public static function recordFailure(Session $session): void
    {
        $failures = $session->get(self::KEY_FAILURES);
        $failures = (is_int($failures) ? $failures : 0) + 1;

        if ($failures >= self::MAX_FAILURES) {
            self::clear($session);

            abort(409, __('two-factor.too_many_failures'));
        }

        $session->put(self::KEY_FAILURES, $failures);
    }

    public static function clear(Session $session): void
    {
        $session->forget([self::KEY_USER_ID, self::KEY_REMEMBER, self::KEY_EXPIRES_AT, self::KEY_FAILURES]);
    }
}
