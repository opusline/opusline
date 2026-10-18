<?php

declare(strict_types=1);

namespace App\Domain\Feedback\Relay;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Cache;

/**
 * A puzzle the relay hands out and takes back once. Stateless until used: the
 * expiry and a random part are signed with the app key, and only spending it
 * writes to the cache, so an unsolved challenge costs the relay nothing.
 */
final class RelayChallenge
{
    public static function issue(): string
    {
        $payload = CarbonImmutable::now()->addSeconds(config()->integer('relay.challenge_ttl_seconds'))->getTimestamp().'.'.bin2hex(random_bytes(16));

        return $payload.'.'.self::signature($payload);
    }

    /** Whether the challenge is genuine, unexpired and spent for the first time now. */
    public static function spend(string $challenge): bool
    {
        $parts = explode('.', $challenge);

        if (count($parts) !== 3) {
            return false;
        }

        [$expiresAt, $random, $signature] = $parts;

        if (! hash_equals(self::signature($expiresAt.'.'.$random), $signature) || (int) $expiresAt < CarbonImmutable::now()->getTimestamp()) {
            return false;
        }

        return Cache::add('relay-challenge:'.hash('sha256', $challenge), true, (int) $expiresAt - CarbonImmutable::now()->getTimestamp() + 1);
    }

    public static function expiresAt(string $challenge): CarbonImmutable
    {
        return CarbonImmutable::createFromTimestamp((int) explode('.', $challenge)[0]);
    }

    private static function signature(string $payload): string
    {
        return hash_hmac('sha256', $payload, config()->string('app.key'));
    }
}
