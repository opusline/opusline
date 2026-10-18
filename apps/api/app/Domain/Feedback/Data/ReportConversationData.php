<?php

declare(strict_types=1);

namespace App\Domain\Feedback\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

/**
 * The conversation so far, as the browser keeps it: text only, the account
 * first and last. Nothing of it is stored here.
 */
class ReportConversationData extends Data
{
    /** @param list<ReportMessageData> $messages */
    public function __construct(
        #[DataCollectionOf(ReportMessageData::class), Min(1), Max(20)]
        public array $messages,
    ) {}
}
