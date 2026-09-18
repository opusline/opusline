<?php

declare(strict_types=1);

namespace App\Domain\Settings\Data;

use App\Domain\Bank\Data\EnableBankingSettingsData;
use Spatie\LaravelData\Data;

/** The third-party services an account has plugged in (Réglages › Intégrations). */
class IntegrationsData extends Data
{
    public function __construct(
        public EnableBankingSettingsData $enableBanking,
    ) {}
}
