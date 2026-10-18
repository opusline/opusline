<?php

declare(strict_types=1);

namespace App\Domain\Feedback\Relay;

/**
 * Hashcash over SHA-256: a nonce is accepted when sha256("challenge:nonce")
 * starts with `difficulty` zero bits. Cheap to check, costly to produce in bulk.
 */
final class ProofOfWork
{
    public static function satisfies(string $challenge, string $nonce, int $difficulty): bool
    {
        return self::leadingZeroBits(hash('sha256', $challenge.':'.$nonce, true)) >= $difficulty;
    }

    /** The first nonce that satisfies the challenge: what a sending instance computes. */
    public static function solve(string $challenge, int $difficulty): string
    {
        for ($nonce = 0; ; $nonce++) {
            if (self::satisfies($challenge, (string) $nonce, $difficulty)) {
                return (string) $nonce;
            }
        }
    }

    private static function leadingZeroBits(string $hash): int
    {
        $bits = 0;

        foreach (str_split($hash) as $byte) {
            $value = ord($byte[0]);

            if ($value === 0) {
                $bits += 8;

                continue;
            }

            return $bits + 7 - (int) floor(log($value, 2));
        }

        return $bits;
    }
}
