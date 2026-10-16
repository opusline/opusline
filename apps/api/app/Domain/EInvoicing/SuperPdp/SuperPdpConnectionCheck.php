<?php

declare(strict_types=1);

namespace App\Domain\EInvoicing\SuperPdp;

use App\Domain\EInvoicing\Enums\PlatformEnvironment;

/** The outcome of asking Super PDP about the account: what the settings page shows. */
final readonly class SuperPdpConnectionCheck
{
    public function __construct(
        /** Null while the platform keeps the company behind its verification. */
        public ?string $companyName,
        public ?string $companyNumber,
        public ?PlatformEnvironment $environment,
        public bool $companyVerified,
        /** The company's addressing identifier in the annuaire; null until it registered there. */
        public ?string $receivingAddress,
    ) {}
}
