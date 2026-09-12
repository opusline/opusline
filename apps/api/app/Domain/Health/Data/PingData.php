<?php

declare(strict_types=1);

namespace App\Domain\Health\Data;

use Spatie\LaravelData\Data;

class PingData extends Data
{
    public function __construct(
        public string $status,
        public string $version,
        public ?SentryWebData $sentry,
    ) {}

    public static function fromConfig(): self
    {
        return new self(
            status: 'ok',
            version: config()->string('app.version'),
            sentry: SentryWebData::fromConfig(),
        );
    }
}
