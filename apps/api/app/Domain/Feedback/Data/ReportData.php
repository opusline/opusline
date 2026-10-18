<?php

declare(strict_types=1);

namespace App\Domain\Feedback\Data;

use App\Domain\Feedback\Enums\ReportKind;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

/**
 * A report an account sends. The body stops short of the relay's 8 000
 * characters so the context and the relay's footer always fit.
 */
class ReportData extends Data
{
    public function __construct(
        #[Enum(ReportKind::class)]
        public ReportKind $kind,
        #[StringType, Min(5), Max(120)]
        public string $title,
        #[StringType, Min(10), Max(6000)]
        public string $body,
        public ?ReportContextData $context,
    ) {}
}
