<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Data;

use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Deadlines\Models\FiscalDeadlineCompletion;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
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

    /**
     * @param  Collection<int, FiscalDeadlineCompletion>  $completions
     */
    public static function in(Collection $completions, FiscalDeadlineKind $kind, string $periodKey): ?self
    {
        return self::fromCompletion($completions->first(
            static fn (FiscalDeadlineCompletion $completion): bool => $completion->kind === $kind && $completion->period_key === $periodKey,
        ));
    }

    public static function fromCompletion(?FiscalDeadlineCompletion $completion): ?self
    {
        return $completion instanceof FiscalDeadlineCompletion
            ? new self(declaredOn: $completion->completed_on, paidOn: $completion->paid_on)
            : null;
    }
}
