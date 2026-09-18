<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use App\Domain\Shared\Validation\EnableBankingPrivateKey;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Attributes\Validation\Uuid;
use Spatie\LaravelData\Data;

class SaveEnableBankingCredentialsData extends Data
{
    public function __construct(
        /** The application id Enable Banking shows in its control panel. */
        #[Uuid]
        public string $applicationId,
        /** The PEM file Enable Banking's control panel downloaded when the application was registered. */
        #[Max(10_000), Rule(new EnableBankingPrivateKey)]
        public string $privateKey,
    ) {}
}
