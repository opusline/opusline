<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Actions;

use App\Domain\Deadlines\Calendar\DeadlineReminders;
use App\Domain\Deadlines\Calendar\DeadlineWindow;
use App\Domain\Deadlines\Calendar\FiscalDeadline;
use App\Domain\Deadlines\Data\CalendarFeedData;
use App\Domain\Deadlines\Data\DeadlineBoardData;
use App\Domain\Deadlines\Data\DeadlineItemData;
use App\Domain\Deadlines\Data\DeadlineReminderData;
use App\Domain\Deadlines\Data\FiscalDeadlineData;
use App\Domain\Deadlines\Enums\DeadlineItemType;
use App\Domain\Deadlines\Models\FiscalDeadlineCompletion;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

/**
 * The Échéances screen in one response: the timeline of invoice dues, relances
 * and fiscal deadlines in due order, what is next, and which fiscal lines are
 * close enough to be worth a reminder.
 *
 * Done lines sink to the bottom rather than leaving: the record stays visible,
 * the way a ledger keeps its settled rows.
 */
class ListDeadlineBoard
{
    public function __construct(
        private readonly GenerateFiscalDeadlines $generateFiscalDeadlines,
        private readonly PriceFiscalDeadlines $priceFiscalDeadlines,
        private readonly ResolveExpectedCfe $resolveExpectedCfe,
        private readonly ListInvoiceDeadlines $listInvoiceDeadlines,
        private readonly ResolveCalendarToken $resolveCalendarToken,
    ) {}

    public function handle(User $user): DeadlineBoardData
    {
        $settings = $user->settingsOrFail();
        $today = $settings->today();
        $window = DeadlineWindow::onScreen($today);

        $expectedCfe = $this->resolveExpectedCfe->handle($settings);
        $deadlines = $this->generateFiscalDeadlines->handle($settings, $window->from, $window->to, $expectedCfe?->amount);
        $prices = $this->priceFiscalDeadlines->handle($user, $settings, $deadlines, $expectedCfe);
        $completions = $user->fiscalDeadlineCompletions()
            ->whereBetween('due_on', [$window->from->toDateString(), $window->to->toDateString()])
            ->get(['kind', 'period_key', 'completed_on'])
            ->keyBy(static fn (FiscalDeadlineCompletion $completion): string => $completion->key());

        $fiscalItems = array_map(
            static fn (FiscalDeadline $deadline): DeadlineItemData => new DeadlineItemData(
                type: DeadlineItemType::Fiscal,
                dueOn: $deadline->dueOn,
                invoice: null,
                fiscal: FiscalDeadlineData::fromOccurrence(
                    $deadline,
                    $prices[$deadline->key()],
                    $completions->get($deadline->key())?->completed_on,
                ),
            ),
            $deadlines,
        );

        $items = [...$this->listInvoiceDeadlines->handle($user, $today), ...$fiscalItems];

        usort(
            $items,
            static fn (DeadlineItemData $a, DeadlineItemData $b): int => [self::isDone($a), $a->dueOn->toDateString(), $a->type->value]
                <=> [self::isDone($b), $b->dueOn->toDateString(), $b->type->value],
        );

        $owed = array_values(array_filter(
            $items,
            static fn (DeadlineItemData $item): bool => ! self::isDone($item),
        ));

        $reminders = $this->reminders($owed, $settings->deadline_reminders_read_at, $today);

        return new DeadlineBoardData(
            next: $owed[0] ?? null,
            items: $items,
            reminders: $reminders,
            calendarToken: $this->resolveCalendarToken->handle($settings),
            calendarFeed: CalendarFeedData::fromSettings($settings),
            calendarSubscribedOn: $settings->calendar_subscribed_on,
            calendarLastSyncedAt: $settings->calendar_last_synced_at,
        );
    }

    /** An invoice line is never "done" on the board: paid invoices carry no line at all. */
    private static function isDone(DeadlineItemData $item): bool
    {
        return $item->fiscal?->completedOn instanceof CarbonImmutable;
    }

    /**
     * The fiscal lines close enough to speak up. Invoice lines stay out of the
     * watermark feed: their lateness is already the timeline's loudest state,
     * and the relance line is the actionable form of it.
     *
     * @param  list<DeadlineItemData>  $owed
     * @return list<DeadlineReminderData>
     */
    private function reminders(array $owed, ?CarbonImmutable $readAt, CarbonImmutable $today): array
    {
        $reminders = [];

        foreach ($owed as $item) {
            if ($item->fiscal === null) {
                continue;
            }

            $triggeredOn = $this->triggeredOn($item->fiscal->dueOn, $today);

            if (! $triggeredOn instanceof CarbonImmutable) {
                continue;
            }

            $reminders[] = new DeadlineReminderData(
                deadline: $item->fiscal,
                isRead: $readAt instanceof CarbonImmutable && $readAt->greaterThanOrEqualTo($triggeredOn),
            );
        }

        return $reminders;
    }

    /**
     * The most recent lead time the deadline has reached, or null while it is
     * still further out than the first one.
     *
     * An overdue deadline stays pinned to its due date, so reading it once
     * settles it: it keeps its place in the list with the days it is late,
     * rather than turning unread again every morning.
     */
    private function triggeredOn(CarbonImmutable $dueOn, CarbonImmutable $today): ?CarbonImmutable
    {
        $triggeredOn = null;

        // Leads are listed furthest-first, so the last one reached is the latest.
        foreach (DeadlineReminders::LEAD_DAYS as $leadDays) {
            $trigger = $dueOn->subDays($leadDays);

            if ($today->greaterThanOrEqualTo($trigger)) {
                $triggeredOn = $trigger;
            }
        }

        return $triggeredOn;
    }
}
