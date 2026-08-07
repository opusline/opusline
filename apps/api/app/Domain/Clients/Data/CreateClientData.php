<?php

declare(strict_types=1);

namespace App\Domain\Clients\Data;

use App\Domain\Clients\Enums\ClientType;
use App\Domain\Shared\Enums\Color;
use App\Domain\Shared\Validation\AuthenticatedUserId;
use App\Domain\Shared\Validation\Siret;
use App\Domain\Shared\Validation\VatNumber;
use Spatie\LaravelData\Attributes\Validation\Between;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\Constraints\WhereConstraint;

class CreateClientData extends Data
{
    public function __construct(
        #[Min(1), Max(255)]
        #[Unique('clients', 'name', where: new WhereConstraint('user_id', new AuthenticatedUserId))]
        public string $name,
        public ClientType $type,
        public ?string $notes = null,
        #[Max(255), Rule(new Siret)]
        public ?string $siret = null,
        #[Max(255), Rule(new VatNumber)]
        public ?string $vatNumber = null,
        #[Max(255)]
        public ?string $billingAddressLine1 = null,
        #[Max(255)]
        public ?string $billingAddressLine2 = null,
        #[Max(32)]
        public ?string $billingPostalCode = null,
        #[Max(255)]
        public ?string $billingCity = null,
        #[Max(255)]
        public ?string $billingCountry = null,
        #[Max(255)]
        public ?string $billingContactName = null,
        #[Max(255), Email]
        public ?string $billingEmail = null,
        public Color $color = Color::Amber,
        #[IntegerType, Between(0, 365)]
        public int $paymentTermsDays = 45,
    ) {}
}
