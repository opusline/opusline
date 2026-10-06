<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Actions;

use App\Domain\Deadlines\Calendar\DeadlineAmount;
use App\Domain\Deadlines\Calendar\DeadlineReminderLine;
use App\Domain\Deadlines\Calendar\DeadlineReminders;
use App\Domain\Deadlines\Calendar\FiscalDeadline;
use App\Domain\Deadlines\Enums\DeadlineItemType;
use App\Domain\Deadlines\Models\FiscalDeadlineCompletion;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

/**
 * What the reminder email names today: every owed deadline that reaches one of
 * the reminder leads on this exact date.
 *
 * Unlike the in-app feed, which keeps an overdue line pinned until it is read,
 * a deadline is listed on its lead days only — an email cannot be marked read,
 * so anything that lingered would be sent again every morning. And unlike that
 * feed it carries the invoices: an account outside France has no fiscal
 * calendar, and its unpaid invoices are the deadlines it has.
 */
class ListDeadlineReminderLines
{
    public function __construct(
        private readonly GenerateFiscalDeadlines $generateFiscalDeadlines,
        private readonly PriceFiscalDeadlines $priceFiscalDeadlines,
        private readonly ResolveExpectedCfe $resolveExpectedCfe,
        private readonly ListInvoiceDeadlines $listInvoiceDeadlines,
    ) {}

    /**
     * @return list<DeadlineReminderLine>
     */
    public function handle(User $user): array
    {
        $settings = $user->settingsOrFail();
        $today = $settings->today();

        $lines = [...$this->fiscalLines($user, $settings, $today), ...$this->invoiceLines($user, $settings, $today)];

        usort(
            $lines,
            static fn (DeadlineReminderLine $a, DeadlineReminderLine $b): int => [$a->leadDays, $a->title] <=> [$b->leadDays, $b->title],
        );

        return $lines;
    }

    /**
     * @return list<DeadlineReminderLine>
     */
    private function fiscalLines(User $user, UserSettings $settings, CarbonImmutable $today): array
    {
        // Before the expected CFE is resolved: that reads a year of bank
        // debits, and an account outside France has no fiscal calendar to price.
        if (! $settings->hasFrenchFiscality()) {
            return [];
        }

        $expectedCfe = $this->resolveExpectedCfe->handle($settings);
        $reaching = [];
        $leadDaysByKey = [];

        foreach ($this->generateFiscalDeadlines->handle(
            $settings,
            $today,
            $today->addDays(max(DeadlineReminders::LEAD_DAYS)),
            $expectedCfe?->amount,
        ) as $deadline) {
            $leadDays = DeadlineReminders::leadReachedOn($deadline->dueOn, $today);

            if ($leadDays !== null) {
                $reaching[$deadline->key()] = $deadline;
                $leadDaysByKey[$deadline->key()] = $leadDays;
            }
        }

        $owed = $this->withoutCompleted($user, $reaching);

        if ($owed === []) {
            return [];
        }

        $prices = $this->priceFiscalDeadlines->handle($user, $settings, $owed, $expectedCfe);

        return array_map(
            static fn (FiscalDeadline $deadline): DeadlineReminderLine => new DeadlineReminderLine(
                title: $deadline->title($settings->locale),
                amount: $prices[$deadline->key()]->label($settings->locale),
                dueOn: $deadline->dueOn,
                leadDays: $leadDaysByKey[$deadline->key()],
            ),
            $owed,
        );
    }

    /**
     * Drops the deadlines already ticked off. Completions are matched on the
     * period they answer for, not on a date: the due date a completion was
     * ticked on stays behind when the CA3 day moves.
     *
     * @param  array<string, FiscalDeadline>  $deadlinesByKey
     * @return list<FiscalDeadline>
     */
    private function withoutCompleted(User $user, array $deadlinesByKey): array
    {
        if ($deadlinesByKey === []) {
            return [];
        }

        $completedKeys = $user->fiscalDeadlineCompletions()
            ->whereIn('period_key', array_column($deadlinesByKey, 'periodKey'))
            ->get(['kind', 'period_key'])
            ->map(static fn (FiscalDeadlineCompletion $completion): string => $completion->key())
            ->all();

        return array_values(array_diff_key($deadlinesByKey, array_flip($completedKeys)));
    }

    /**
     * @return list<DeadlineReminderLine>
     */
    private function invoiceLines(User $user, UserSettings $settings, CarbonImmutable $today): array
    {
        $lines = [];

        foreach ($this->listInvoiceDeadlines->handle($user, $today) as $item) {
            if ($item->type !== DeadlineItemType::InvoiceDue || $item->invoice === null) {
                continue;
            }

            $leadDays = DeadlineReminders::leadReachedOn($item->dueOn, $today);

            if ($leadDays === null) {
                continue;
            }

            $lines[] = new DeadlineReminderLine(
                title: __('mail.deadlines.invoice', [
                    'number' => $item->invoice->reference(),
                    'client' => $item->invoice->clientName,
                ], $settings->locale->languageTag()),
                amount: DeadlineAmount::billed($item->invoice->amount->toMoney())->label($settings->locale),
                dueOn: $item->dueOn,
                leadDays: $leadDays,
            );
        }

        return $lines;
    }
}
