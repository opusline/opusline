<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Data;

use App\Domain\Settings\Models\UserSettings;
use Spatie\LaravelData\Data;

/**
 * Which kinds of entries the subscribed ICS feed carries — the checkboxes of
 * the « S'abonner au calendrier » dialog, stored so the unauthenticated feed
 * route can honour them.
 */
class CalendarFeedData extends Data
{
    public function __construct(
        public bool $invoices,
        public bool $reminders,
        public bool $vat,
        public bool $urssaf,
        public bool $other,
    ) {}

    public static function fromSettings(UserSettings $settings): self
    {
        return new self(
            invoices: $settings->calendar_feed_invoices,
            reminders: $settings->calendar_feed_reminders,
            vat: $settings->calendar_feed_vat,
            urssaf: $settings->calendar_feed_urssaf,
            other: $settings->calendar_feed_other,
        );
    }
}
