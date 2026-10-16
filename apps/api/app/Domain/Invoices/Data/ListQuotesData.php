<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\QuoteStatus;
use App\Domain\Shared\Validation\AuthenticatedUserId;
use Spatie\LaravelData\Attributes\Validation\BooleanType;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\Constraints\WhereConstraint;

class ListQuotesData extends Data
{
    public function __construct(
        #[Enum(QuoteStatus::class)]
        public ?QuoteStatus $status = null,
        /** True for the sent quotes past their validity, false for the ones still open. */
        #[BooleanType]
        public ?bool $expired = null,
        #[IntegerType]
        #[Exists('clients', 'id', where: new WhereConstraint('user_id', new AuthenticatedUserId))]
        public ?int $clientId = null,
        #[IntegerType]
        #[Exists('missions', 'id', where: new WhereConstraint('user_id', new AuthenticatedUserId))]
        public ?int $missionId = null,
    ) {}
}
