<?php

declare(strict_types=1);

namespace App\Domain\Settings\Rates;

use App\Domain\Settings\Models\UserSettings;

/**
 * Whether the versement libératoire was in force, and at what rate.
 *
 * Recorded beside the contribution rate rather than read off the settings when
 * needed: the 2042-C PRO routes a whole past year's receipts to case 5TE or
 * 5HQ on this flag, and an account that switched the option on in July cannot
 * be asked what January was filed under.
 */
final readonly class LiberatingPayment
{
    public function __construct(
        public bool $isPaid,
        public int $rateBp,
    ) {}

    public static function of(UserSettings $settings): self
    {
        return new self($settings->liberating_payment, $settings->liberating_payment_rate_bp);
    }
}
