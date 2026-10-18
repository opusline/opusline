<?php

declare(strict_types=1);

namespace App\Domain\Feedback\Data;

use App\Domain\Feedback\Enums\ReportKind;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Attributes\Validation\Uuid;
use Spatie\LaravelData\Data;

/** A report an instance hands the relay, with the proof of work that pays for it. */
class RelayReportData extends Data
{
    public function __construct(
        #[Enum(ReportKind::class)]
        public ReportKind $kind,
        #[StringType, Min(5), Max(120)]
        public string $title,
        #[StringType, Min(10), Max(8000)]
        public string $body,
        #[StringType, Uuid]
        public string $instanceId,
        #[StringType, Max(32)]
        public string $version,
        #[StringType, Max(128)]
        public string $challenge,
        #[StringType, Max(32)]
        public string $nonce,
    ) {}
}
