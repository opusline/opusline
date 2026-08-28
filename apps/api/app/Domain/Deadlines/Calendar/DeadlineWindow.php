<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Calendar;

use Carbon\CarbonImmutable;

/**
 * The spans of calendar the app works in. Named here rather than inlined at
 * each caller so the screen, the completions it writes and the subscribed feed
 * cannot drift into disagreeing about which occurrences exist.
 */
final readonly class DeadlineWindow
{
    private const int SCREEN_LOOKBACK_MONTHS = 2;

    private const int SCREEN_HORIZON_MONTHS = 12;

    private const int FEED_LOOKBACK_MONTHS = 12;

    private const int FEED_HORIZON_MONTHS = 18;

    private function __construct(public CarbonImmutable $from, public CarbonImmutable $to) {}

    /**
     * What the Échéances screen shows and what a completion may be written
     * against: far enough back to still tick off what slipped, far enough
     * forward to plan the year.
     */
    public static function onScreen(CarbonImmutable $today): self
    {
        return new self(
            $today->subMonths(self::SCREEN_LOOKBACK_MONTHS),
            $today->addMonths(self::SCREEN_HORIZON_MONTHS),
        );
    }

    /** What a subscribed calendar keeps: the year behind for the record, well ahead for planning. */
    public static function inFeed(CarbonImmutable $today): self
    {
        return new self(
            $today->subMonths(self::FEED_LOOKBACK_MONTHS),
            $today->addMonths(self::FEED_HORIZON_MONTHS),
        );
    }
}
