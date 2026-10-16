<?php

declare(strict_types=1);

namespace App\Domain\EInvoicing\Platform;

/** What the annuaire says about a company before an invoice is sent to it. */
final readonly class RecipientLookup
{
    public function __construct(
        public string $siren,
        /** The company can receive electronic invoices; false until it chose a platform. */
        public bool $reachable,
        /** The platform the annuaire routes to, as it names it, when known. */
        public ?string $platformName,
    ) {}
}
