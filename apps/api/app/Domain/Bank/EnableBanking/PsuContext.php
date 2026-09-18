<?php

declare(strict_types=1);

namespace App\Domain\Bank\EnableBanking;

/**
 * The account holder's own request, forwarded to the bank. Its presence tells
 * the bank the holder is at the keyboard, which lifts the PSD2 cap of four
 * unattended reads a day.
 */
final readonly class PsuContext
{
    public function __construct(
        public string $ipAddress,
        public string $userAgent,
    ) {}

    /**
     * @return array<string, string>
     */
    public function headers(): array
    {
        return array_filter([
            'Psu-Ip-Address' => $this->ipAddress,
            'Psu-User-Agent' => $this->userAgent,
        ], static fn (string $value): bool => $value !== '');
    }
}
