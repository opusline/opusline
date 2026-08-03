<?php

declare(strict_types=1);

namespace App\Domain\Clients\Data;

use App\Domain\Shared\Validation\AuthenticatedUserId;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\Constraints\WhereConstraint;

class CreateClientData extends Data
{
    public function __construct(
        #[Min(1), Max(255)]
        #[Unique('clients', 'name', where: new WhereConstraint('user_id', new AuthenticatedUserId))]
        public string $name,
        public ?string $notes = null,
    ) {}
}
