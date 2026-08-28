<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Data;

use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/**
 * Everything the Échéances screen and the week tile read: the timeline of
 * invoice dues, relances to send and fiscal deadlines, plus the feed the
 * subscribe dialog manages.
 *
 * `next` is not simply the head of `items`: the list keeps what is already
 * done so the record stays visible, while `next` is the first thing still
 * calling for the user.
 */
class DeadlineBoardData extends Data
{
    public function __construct(
        public ?DeadlineItemData $next,
        /** @var list<DeadlineItemData> */
        #[DataCollectionOf(DeadlineItemData::class)]
        public array $items,
        /**
         * What is close enough to say out loud, for the sidebar badge. The
         * count is how many are unread — a number, not a second field that
         * could disagree.
         *
         * @var list<DeadlineReminderData>
         */
        #[DataCollectionOf(DeadlineReminderData::class)]
        public array $reminders,
        /**
         * The ICS feed's credential. The client composes the address from it —
         * against the host the app is actually served from, which a self-host
         * behind a proxy needs and APP_URL cannot be trusted to know.
         */
        public string $calendarToken,
        public CalendarFeedData $calendarFeed,
        /** The day the user said the address was added; null while unsubscribed. */
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $calendarSubscribedOn,
        /** The last time a calendar actually fetched the feed — the proof it lives. */
        public ?CarbonImmutable $calendarLastSyncedAt,
    ) {}
}
