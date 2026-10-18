<?php

declare(strict_types=1);

namespace App\Domain\Shared\Anthropic\Data;

use App\Domain\Settings\Models\UserSettings;
use App\Domain\Shared\Anthropic\AnthropicClient;
use Spatie\LaravelData\Data;

/** Whether the account gave Claude a key, never the key itself. */
class AnthropicSettingsData extends Data
{
    public function __construct(
        public bool $hasApiKey,
        /** The model this instance asks, so the card can say which one bills the key. */
        public string $model,
    ) {}

    public static function fromSettings(UserSettings $settings): self
    {
        return new self(hasApiKey: $settings->anthropic_api_key !== null, model: AnthropicClient::model());
    }
}
