<?php

declare(strict_types=1);

namespace App\Domain\Feedback\Data;

use Spatie\LaravelData\Data;

/** An open issue on the project's tracker that a report may repeat. */
class OpenIssueData extends Data
{
    public function __construct(
        public int $number,
        public string $title,
        public string $url,
    ) {}
}
