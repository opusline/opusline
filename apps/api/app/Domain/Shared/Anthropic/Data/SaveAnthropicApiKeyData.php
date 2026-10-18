<?php

declare(strict_types=1);

namespace App\Domain\Shared\Anthropic\Data;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class SaveAnthropicApiKeyData extends Data
{
    public function __construct(
        /** An API key from console.anthropic.com. A pattern, not StartsWith, so the generated form schema checks it too. */
        #[StringType, Regex('/^sk-ant-[A-Za-z0-9_-]+$/'), Max(255)]
        public string $apiKey,
    ) {}
}
