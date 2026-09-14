<?php

declare(strict_types=1);

namespace App\Http\Users\Support;

use App\Domain\Users\Models\User;
use Illuminate\Contracts\Session\Session;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;

/**
 * The state between a correct password and a correct second factor. It lives
 * in the guest session as plain scalars, expires on its own, and is discarded
 * after a handful of wrong answers so the password has to be proven again.
 *
 * Proving the password again starts a fresh session allowance, so the wrong
 * answers are also counted against the account itself, where a new login
 * cannot reset them: without that, the password holder guesses codes at the
 * login limiter's pace for as long as they like.
 */
final class PendingLogin
{
    public const string KEY_USER_ID = 'login.id';

    public const string KEY_REMEMBER = 'login.remember';

    public const string KEY_EXPIRES_AT = 'login.expires_at';

    public const string KEY_FAILURES = 'login.failures';

    public const string KEY_PASSWORD_FINGERPRINT = 'login.password';

    public const int TTL_SECONDS = 300;

    public const int MAX_FAILURES = 5;

    public const int MAX_ACCOUNT_FAILURES = 10;

    public const int ACCOUNT_FAILURE_WINDOW_SECONDS = 15 * 60;

    public static function start(Session $session, User $user, bool $remember): void
    {
        $session->put([
            self::KEY_USER_ID => $user->id,
            self::KEY_REMEMBER => $remember,
            self::KEY_EXPIRES_AT => now()->getTimestamp() + self::TTL_SECONDS,
            self::KEY_FAILURES => 0,
            self::KEY_PASSWORD_FINGERPRINT => self::passwordFingerprint($user),
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

        $user = User::query()->find($userId);
        $fingerprint = $session->get(self::KEY_PASSWORD_FINGERPRINT);

        // A password changed since it was proven here is no longer proven.
        if (! $user instanceof User || ! is_string($fingerprint) || ! hash_equals(self::passwordFingerprint($user), $fingerprint)) {
            self::clear($session);

            return null;
        }

        return $user;
    }

    public static function isAccountLockedOut(User $user): bool
    {
        return RateLimiter::tooManyAttempts(self::accountFailuresKey($user->id), self::MAX_ACCOUNT_FAILURES);
    }

    public static function clearAccountFailures(User $user): void
    {
        RateLimiter::clear(self::accountFailuresKey($user->id));
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
        $userId = $session->get(self::KEY_USER_ID);

        if (is_int($userId)) {
            RateLimiter::hit(self::accountFailuresKey($userId), self::ACCOUNT_FAILURE_WINDOW_SECONDS);
        }

        $failures = $session->get(self::KEY_FAILURES);
        $failures = (is_int($failures) ? $failures : 0) + 1;

        if ($failures >= self::MAX_FAILURES) {
            // The allowance is spent: somebody holds the password and is
            // guessing the second factor. Nothing else in the stack says so.
            Log::warning('Two-factor challenge abandoned after too many wrong answers.', [
                'user_id' => $userId,
                'ip' => request()->ip(),
                'failures' => $failures,
            ]);

            self::clear($session);

            abort(409, __('two-factor.too_many_failures'));
        }

        $session->put(self::KEY_FAILURES, $failures);
    }

    public static function clear(Session $session): void
    {
        $session->forget([self::KEY_USER_ID, self::KEY_REMEMBER, self::KEY_EXPIRES_AT, self::KEY_FAILURES, self::KEY_PASSWORD_FINGERPRINT]);
    }

    private static function accountFailuresKey(int $userId): string
    {
        return 'two-factor-failures:'.$userId;
    }

    /** The session store is not the place for the hash itself. */
    private static function passwordFingerprint(User $user): string
    {
        return hash('sha256', $user->getAuthPassword());
    }
}
