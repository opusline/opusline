<?php

declare(strict_types=1);

namespace App\Domain\EInvoicing\Data;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

class SaveSuperPdpCredentialsData extends Data
{
    public function __construct(
        /** The client id of the application created under Developers in Super PDP's dashboard. */
        #[Min(8), Max(128)]
        public string $clientId,
        /** Its client secret, shown once at creation. */
        #[Min(8), Max(512)]
        public string $clientSecret,
    ) {}
}
