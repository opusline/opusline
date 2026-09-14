<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Data;

use App\Domain\Deadlines\Models\FiscalDeadlineCompletion;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/** The user's own ticks: the day the return was marked as filed, and as paid. */
class DeclarationCompletionData extends Data
{
    public function __construct(
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $declaredOn,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $paidOn,
    ) {}

    public static function fromCompletion(?FiscalDeadlineCompletion $completion): ?self
    {
        return $completion instanceof FiscalDeadlineCompletion
            ? new self(declaredOn: $completion->completed_on, paidOn: $completion->paid_on)
            : null;
    }
}
