<?php

declare(strict_types=1);

namespace App\Domain\Bank\Enums;

/**
 * Which login the bank shows: a business account's or a personal one's. Banks
 * offering both need it said up front, or the consent can miss the account.
 */
enum BankPsuType: int
{
    case Business = 0;
    case Personal = 1;

    public function apiValue(): string
    {
        return match ($this) {
            self::Business => 'business',
            self::Personal => 'personal',
        };
    }

    public static function fromApiValue(string $value): ?self
    {
        return match ($value) {
            'business' => self::Business,
            'personal' => self::Personal,
            default => null,
        };
    }
}
