<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use Spatie\LaravelData\Data;

class BankAuthorizationData extends Data
{
    public function __construct(
        /** Where to send the browser to authorize at the bank; it comes back to the redirect URL. */
        public string $url,
    ) {}
}
