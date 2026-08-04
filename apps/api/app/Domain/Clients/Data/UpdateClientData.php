<?php

declare(strict_types=1);

namespace App\Domain\Clients\Data;

use App\Domain\Clients\Enums\ClientType;
use App\Domain\Shared\Enums\Color;
use App\Domain\Shared\Validation\AuthenticatedUserId;
use Spatie\LaravelData\Attributes\Validation\Between;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\Constraints\WhereConstraint;
use Spatie\LaravelData\Support\Validation\References\RouteParameterReference;

class UpdateClientData extends Data
{
    public function __construct(
        #[Min(1), Max(255)]
        #[Unique(
            'clients',
            'name',
            ignore: new RouteParameterReference('client', 'id', nullable: true),
            where: new WhereConstraint('user_id', new AuthenticatedUserId),
        )]
        public string $name,
        public ClientType $type,
        public ?string $notes = null,
        #[Max(255)]
        public ?string $siret = null,
        #[Max(255)]
        public ?string $vatNumber = null,
        public ?string $billingAddress = null,
        #[Max(255)]
        public ?string $billingContactName = null,
        #[Max(255), Email]
        public ?string $billingEmail = null,
        public Color $color = Color::Amber,
        #[IntegerType, Between(0, 365)]
        public int $paymentTermsDays = 45,
    ) {}
}
