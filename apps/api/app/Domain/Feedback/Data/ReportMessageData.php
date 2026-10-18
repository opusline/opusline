<?php

declare(strict_types=1);

namespace App\Domain\Feedback\Data;

use App\Domain\Feedback\Enums\ReportSpeaker;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class ReportMessageData extends Data
{
    public function __construct(
        #[Enum(ReportSpeaker::class)]
        public ReportSpeaker $speaker,
        #[StringType, Min(1), Max(4000)]
        public string $text,
    ) {}
}
