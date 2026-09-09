<?php

declare(strict_types=1);

namespace App\Domain\TwoFactor\Totp;

final class TotpVerifier
{
    /**
     * The time step the code matched, or null. One step of drift is tolerated
     * on each side; a step at or before the last accepted one is refused so a
     * code cannot be replayed inside its window.
     *
     * @param  non-empty-string  $code
     */
    public function verify(string $secret, string $code, ?int $lastUsedStep): ?int
    {
        $totp = TotpSecret::totp($secret);
        $period = $totp->getPeriod();
        $now = now()->getTimestamp();

        foreach ([0, -1, 1] as $drift) {
            $timestamp = max(0, $now + $drift * $period);
            $step = intdiv($timestamp, $period);

            if ($lastUsedStep !== null && $step <= $lastUsedStep) {
                continue;
            }

            if ($totp->verify($code, $timestamp)) {
                return $step;
            }
        }

        return null;
    }
}
