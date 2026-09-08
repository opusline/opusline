<?php

declare(strict_types=1);

namespace App\Http\Passkeys\Support;

use Illuminate\Contracts\Session\Session;

/**
 * The options issued for a WebAuthn ceremony, parked in the session between
 * the two requests it takes. Read once: whatever the browser answers, the
 * challenge inside cannot be replayed.
 */
final class PasskeyChallenge
{
    public const string REGISTRATION = 'passkey.registration';

    public const string LOGIN = 'passkey.login';

    public const string SECOND_FACTOR = 'passkey.challenge';

    public const int TTL_SECONDS = 300;

    /**
     * @param  array<string, mixed>  $options
     */
    public static function put(Session $session, string $key, array $options): void
    {
        $session->put($key, [
            'options' => $options,
            'expires_at' => now()->getTimestamp() + self::TTL_SECONDS,
        ]);
    }

    /**
     * @return array<string, mixed>|null
     */
    public static function pull(Session $session, string $key): ?array
    {
        $stored = $session->pull($key);

        if (! is_array($stored)) {
            return null;
        }

        $options = $stored['options'] ?? null;
        $expiresAt = $stored['expires_at'] ?? null;

        if (! is_array($options) || ! is_int($expiresAt) || $expiresAt <= now()->getTimestamp()) {
            return null;
        }

        /** @var array<string, mixed> $options */
        return $options;
    }
}
