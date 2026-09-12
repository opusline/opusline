<?php

declare(strict_types=1);

namespace App\Domain\Health\Data;

use Spatie\LaravelData\Data;

class SentryWebData extends Data
{
    public function __construct(
        public string $dsn,
        public string $environment,
        public float $tracesSampleRate,
    ) {}

    /**
     * Null when the instance has no browser DSN: the SPA then loads no Sentry
     * at all. The environment falls back to APP_ENV exactly as the PHP SDK
     * does, so both halves of one instance land in one Sentry environment.
     */
    public static function fromConfig(): ?self
    {
        $dsn = config('services.sentry.web_dsn');

        if (! is_string($dsn) || $dsn === '') {
            return null;
        }

        $environment = config('sentry.environment');

        return new self(
            dsn: $dsn,
            environment: is_string($environment) && $environment !== '' ? $environment : app()->environment(),
            tracesSampleRate: config()->float('services.sentry.web_traces_sample_rate'),
        );
    }
}
