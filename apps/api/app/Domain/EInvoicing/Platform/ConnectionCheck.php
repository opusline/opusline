<?php

declare(strict_types=1);

namespace App\Domain\EInvoicing\Platform;

use App\Domain\EInvoicing\Enums\PlatformEnvironment;

/** What the platform says about the account behind the credentials: the settings page's facts. */
final readonly class ConnectionCheck
{
    public function __construct(
        /** Null while the platform keeps the company behind its verification. */
        public ?string $companyName,
        public ?string $companyNumber,
        public ?PlatformEnvironment $environment,
        /** Business calls answer 403 until the platform verified the company. */
        public bool $companyVerified,
        /** The company's addressing identifier in the annuaire; null until it registered there. */
        public ?string $receivingAddress,
    ) {}

    public static function unverified(): self
    {
        return new self(null, null, null, false, null);
    }
}
