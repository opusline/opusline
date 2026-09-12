<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Data;

use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/** The user's own tick: the day the return was marked as filed. */
class DeclarationCompletionData extends Data
{
    public function __construct(
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $declaredOn,
    ) {}

    public static function on(?CarbonImmutable $declaredOn): ?self
    {
        return $declaredOn instanceof CarbonImmutable ? new self(declaredOn: $declaredOn) : null;
    }
}
