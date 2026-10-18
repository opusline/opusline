<?php

declare(strict_types=1);

namespace App\Domain\Feedback\Data;

use App\Domain\Feedback\Enums\ReportKind;
use Spatie\LaravelData\Data;

/** What Claude proposes to file; the account edits it before sending. */
class ReportDraftData extends Data
{
    public function __construct(
        public ReportKind $kind,
        public string $title,
        public string $body,
    ) {}
}
