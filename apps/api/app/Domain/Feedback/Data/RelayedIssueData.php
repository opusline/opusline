<?php

declare(strict_types=1);

namespace App\Domain\Feedback\Data;

use Spatie\LaravelData\Data;

/** The GitHub issue a report became. */
class RelayedIssueData extends Data
{
    public function __construct(
        public int $number,
        public string $url,
    ) {}
}
