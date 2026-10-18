<?php

declare(strict_types=1);

namespace App\Domain\Shared\Anthropic;

use Anthropic\Client;
use Illuminate\Support\Facades\Http;

/**
 * Claude, on the account's own Anthropic key. The SDK leaves timeouts to the
 * HTTP client it is handed, so it gets Laravel's: bounded, and visible to
 * Http::fake() in tests like every other outbound call.
 */
final class AnthropicClient
{
    public static function forKey(string $apiKey): Client
    {
        $transporter = Http::connectTimeout(5)
            ->timeout(config()->integer('services.anthropic.timeout_seconds'))
            ->buildClient();

        return new Client(apiKey: $apiKey, requestOptions: ['transporter' => $transporter, 'maxRetries' => 1]);
    }

    public static function model(): string
    {
        return config()->string('services.anthropic.model');
    }
}
