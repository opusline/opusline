<?php

declare(strict_types=1);

namespace App\Domain\Users\Data;

use App\Domain\Users\Enums\Theme;
use Spatie\LaravelData\Data;

class UpdateUserThemeData extends Data
{
    public function __construct(
        public Theme $theme,
    ) {}
}
