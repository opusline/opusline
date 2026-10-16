<?php

declare(strict_types=1);

namespace App\Domain\EInvoicing\SuperPdp;

use App\Domain\EInvoicing\Enums\PlatformEnvironment;

/** What Super PDP knows of the company behind the credentials. */
final readonly class SuperPdpCompany
{
    public function __construct(
        public string $name,
        public ?string $number,
        public ?PlatformEnvironment $environment,
    ) {}
}
