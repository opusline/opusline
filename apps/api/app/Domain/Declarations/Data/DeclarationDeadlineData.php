<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Data;

use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

class DeclarationDeadlineData extends Data
{
    public function __construct(
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $dueOn,
        /** Days from the account's today to the due date; negative once it has passed. */
        public int $daysLeft,
    ) {}

    public static function on(CarbonImmutable $dueOn, CarbonImmutable $today): self
    {
        return new self(
            dueOn: $dueOn,
            daysLeft: (int) $today->diffInDays($dueOn, absolute: false),
        );
    }
}
