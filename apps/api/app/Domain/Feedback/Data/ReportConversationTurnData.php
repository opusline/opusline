<?php

declare(strict_types=1);

namespace App\Domain\Feedback\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/** Claude's answer: a question or a summary, and the draft once it has enough. */
class ReportConversationTurnData extends Data
{
    /** @param list<OpenIssueData> $duplicates */
    public function __construct(
        public string $reply,
        public ?ReportDraftData $draft,
        /** Open issues Claude found that may already say the same thing. */
        #[DataCollectionOf(OpenIssueData::class)]
        public array $duplicates,
    ) {}
}
