<?php

declare(strict_types=1);

namespace App\Domain\EInvoicing\Platform;

use App\Domain\EInvoicing\Enums\LifecycleStatus;
use Carbon\CarbonImmutable;

/**
 * A supplier's invoice the platform holds for the account. The structured
 * part is what Dépenses needs to draft the expense; the Factur-X file is
 * fetched on its own, since it is the legal original and can weigh.
 */
final readonly class ReceivedInvoice
{
    public function __construct(
        public string $platformId,
        public string $supplierName,
        public ?string $supplierSiren,
        public string $number,
        public CarbonImmutable $issuedOn,
        public ?CarbonImmutable $dueOn,
        public int $amountHtCents,
        public int $amountTtcCents,
        public string $currency,
        public LifecycleStatus $status,
    ) {}
}
