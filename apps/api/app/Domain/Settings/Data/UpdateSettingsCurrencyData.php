<?php

declare(strict_types=1);

namespace App\Domain\Settings\Data;

use App\Domain\Shared\Enums\Currency;
use Spatie\LaravelData\Data;

class UpdateSettingsCurrencyData extends Data
{
    public function __construct(
        public Currency $currency,
    ) {}
}
