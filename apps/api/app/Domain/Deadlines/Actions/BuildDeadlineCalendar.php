<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Actions;

use App\Domain\Deadlines\Calendar\DeadlineAmount;
use App\Domain\Deadlines\Calendar\DeadlinePeriod;
use App\Domain\Deadlines\Calendar\DeadlineReminders;
use App\Domain\Deadlines\Calendar\DeadlineWindow;
use App\Domain\Deadlines\Calendar\FiscalDeadline;
use App\Domain\Deadlines\Data\DeadlineInvoiceData;
use App\Domain\Deadlines\Enums\DeadlineItemType;
use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Deadlines\Models\FiscalDeadlineCompletion;
use App\Domain\Settings\Enums\Locale;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Users\Models\User;
use Cknow\Money\Money;
use Illuminate\Support\Collection;
use Spatie\IcalendarGenerator\Components\Calendar;
use Spatie\IcalendarGenerator\Components\Event;

/**
 * The account's deadlines as a subscribable ICS feed.
 *
 * Written for a calendar that re-fetches rather than imports once: every event
 * carries a stable identifier built from the occurrence, so a refresh replaces
 * what is already there instead of piling duplicates on top of it.
 *
 * The route is unauthenticated, so the locale cannot come from the request and
 * app()->setLocale() would leak across an Octane worker's requests — every
 * string is translated against the account's own locale explicitly.
 */
class BuildDeadlineCalendar
{
    private const int REFRESH_MINUTES = 12 * 60;

    /** Days after an unpaid invoice's due date the relance nudge lands. */
    private const int REMINDER_LAG_DAYS = 3;

    public function __construct(
        private readonly GenerateFiscalDeadlines $generateFiscalDeadlines,
        private readonly PriceFiscalDeadlines $priceFiscalDeadlines,
        private readonly ResolveExpectedCfe $resolveExpectedCfe,
        private readonly ListInvoiceDeadlines $listInvoiceDeadlines,
    ) {}

    public function handle(User $user): string
    {
        $settings = $user->settingsOrFail();
        $locale = $settings->locale;
        $window = DeadlineWindow::inFeed($settings->today());

        $expectedCfe = $this->resolveExpectedCfe->handle($settings);
        $deadlines = $this->generateFiscalDeadlines->handle($settings, $window->from, $window->to, $expectedCfe?->amount);
        $prices = $this->priceFiscalDeadlines->handle($user, $settings, $deadlines, $expectedCfe);
        $completions = $user->fiscalDeadlineCompletions()
            ->whereBetween('due_on', [$window->from->toDateString(), $window->to->toDateString()])
            ->get(['kind', 'period_key', 'completed_on'])
            ->keyBy(static fn (FiscalDeadlineCompletion $completion): string => $completion->key());

        $calendar = Calendar::create(__('deadlines.calendar_name', [], $locale->languageTag()))
            ->description(__('deadlines.calendar_description', [], $locale->languageTag()))
            ->refreshInterval(self::REFRESH_MINUTES);

        foreach ($deadlines as $deadline) {
            if (! $this->feedCarries($settings, $deadline->kind)) {
                continue;
            }

            $calendar->event($this->event($user, $deadline, $prices[$deadline->key()], $completions, $locale));
        }

        if ($settings->calendar_feed_invoices || $settings->calendar_feed_reminders) {
            foreach ($this->listInvoiceDeadlines->handle($user, $settings->today()) as $item) {
                if ($item->invoice === null) {
                    continue;
                }

                if ($item->type === DeadlineItemType::InvoiceDue && $settings->calendar_feed_invoices) {
                    $calendar->event($this->invoiceEvent($user, $item->invoice, $locale));
                }

                if ($item->type === DeadlineItemType::InvoiceReminder && $settings->calendar_feed_reminders) {
                    $calendar->event($this->reminderEvent($user, $item->invoice, $locale));
                }
            }
        }

        return $calendar->get();
    }

    /** The dialog's checkboxes, mapped onto the fiscal kinds they name. */
    private function feedCarries(UserSettings $settings, FiscalDeadlineKind $kind): bool
    {
        return match ($kind) {
            FiscalDeadlineKind::VatCa3, FiscalDeadlineKind::VatCa12 => $settings->calendar_feed_vat,
            FiscalDeadlineKind::UrssafDeclaration => $settings->calendar_feed_urssaf,
            FiscalDeadlineKind::Cfe, FiscalDeadlineKind::CfeInstalment => $settings->calendar_feed_other,
        };
    }

    /** One entry per open invoice, at its due date; a paid one simply stops appearing. */
    private function invoiceEvent(User $user, DeadlineInvoiceData $invoice, Locale $locale): Event
    {
        return Event::create(__('deadlines.event_invoice_title', [
            'number' => $invoice->number ?? (string) $invoice->id,
            'client' => $invoice->clientName,
        ], $locale->languageTag()))
            ->uniqueIdentifier(sprintf('opusline-%d-inv-%d', $user->id, $invoice->id))
            ->startsAt($invoice->dueOn)
            ->fullDay()
            ->description(__('deadlines.event_expected', [
                'amount' => $invoice->amount->toMoney()->format($locale->value),
            ], $locale->languageTag()));
    }

    /** The nudge, a few days past due — the modal's « trois jours après l'échéance ». */
    private function reminderEvent(User $user, DeadlineInvoiceData $invoice, Locale $locale): Event
    {
        return Event::create(__('deadlines.event_reminder_title', [
            'client' => $invoice->clientName,
            'number' => $invoice->number ?? (string) $invoice->id,
        ], $locale->languageTag()))
            ->uniqueIdentifier(sprintf('opusline-%d-rem-%d', $user->id, $invoice->id))
            ->startsAt($invoice->dueOn->addDays(self::REMINDER_LAG_DAYS))
            ->fullDay();
    }

    /**
     * @param  Collection<string, FiscalDeadlineCompletion>  $completions
     */
    private function event(
        User $user,
        FiscalDeadline $deadline,
        DeadlineAmount $price,
        Collection $completions,
        Locale $locale,
    ): Event {
        $event = Event::create($this->title($deadline, $locale))
            // Scoped to the account: two users share no calendar, and a
            // regenerated token must not orphan what is already subscribed.
            ->uniqueIdentifier(sprintf(
                'opusline-%d-%d-%s',
                $user->id,
                $deadline->kind->value,
                $deadline->periodKey,
            ))
            ->startsAt($deadline->dueOn)
            ->fullDay()
            ->description($this->description($deadline, $price, $completions, $locale));

        foreach (DeadlineReminders::alertMinutesBefore() as $minutes) {
            $event->alertMinutesBefore($minutes);
        }

        return $event;
    }

    private function title(FiscalDeadline $deadline, Locale $locale): string
    {
        return __('deadlines.event_title', [
            'obligation' => __("deadlines.kind.{$deadline->kind->name}", [], $locale->languageTag()),
            'period' => $this->periodLabel($deadline, $locale),
        ], $locale->languageTag());
    }

    /**
     * @param  Collection<string, FiscalDeadlineCompletion>  $completions
     */
    private function description(
        FiscalDeadline $deadline,
        DeadlineAmount $price,
        Collection $completions,
        Locale $locale,
    ): string {
        $lines = [];

        if ($price->amount instanceof Money) {
            $lines[] = __(
                $price->isEstimate ? 'deadlines.event_estimate' : 'deadlines.event_expected',
                ['amount' => $price->amount->format($locale->value)],
                $locale->languageTag(),
            );
        }

        if ($completions->has($deadline->key())) {
            $lines[] = __('deadlines.event_completed', [], $locale->languageTag());
        }

        return implode("\n", $lines);
    }

    private function periodLabel(FiscalDeadline $deadline, Locale $locale): string
    {
        return match ($deadline->period) {
            DeadlinePeriod::Year => $deadline->periodKey,
            DeadlinePeriod::Quarter => __('deadlines.period_quarter', [
                'quarter' => $deadline->periodStart->quarter,
                'year' => $deadline->periodStart->year,
            ], $locale->languageTag()),
            // settings() returns a Carbon, where locale() is a getter/setter union.
            DeadlinePeriod::Month => $deadline->periodStart
                ->settings(['locale' => $locale->languageTag()])
                ->translatedFormat('F Y'),
        };
    }
}
