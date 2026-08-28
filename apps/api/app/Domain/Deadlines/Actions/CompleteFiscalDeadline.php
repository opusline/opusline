<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Actions;

use App\Domain\Deadlines\Calendar\DeadlineWindow;
use App\Domain\Deadlines\Calendar\FiscalDeadline;
use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Users\Models\User;

/**
 * Ticks off one occurrence. The occurrence must be one the account's own
 * profile actually produces — nothing else can be marked done, so a stale tab
 * or a hand-made request cannot leave a row nothing will ever match again.
 *
 * The due date is copied onto the row so the record still reads correctly after
 * a settings change moves the date the occurrence would be generated with, and
 * the completion day is the account's own — a tick at 09:00 in Auckland is not
 * yesterday just because UTC says so.
 */
class CompleteFiscalDeadline
{
    public function __construct(
        private readonly GenerateFiscalDeadlines $generateFiscalDeadlines,
        private readonly ResolveExpectedCfe $resolveExpectedCfe,
    ) {}

    public function handle(User $user, FiscalDeadlineKind $kind, string $periodKey): void
    {
        $settings = $user->settingsOrFail();
        $deadline = $this->find($settings, $kind, $periodKey);

        abort_if(! $deadline instanceof FiscalDeadline, 404, __('deadlines.unknown_occurrence'));

        $user->fiscalDeadlineCompletions()->updateOrCreate(
            ['kind' => $kind, 'period_key' => $periodKey],
            ['due_on' => $deadline->dueOn, 'completed_on' => $settings->today()],
        );
    }

    private function find(UserSettings $settings, FiscalDeadlineKind $kind, string $periodKey): ?FiscalDeadline
    {
        $window = DeadlineWindow::onScreen($settings->today());
        $expectedCfe = $this->resolveExpectedCfe->handle($settings);

        foreach ($this->generateFiscalDeadlines->handle($settings, $window->from, $window->to, $expectedCfe?->amount) as $deadline) {
            if ($deadline->kind === $kind && $deadline->periodKey === $periodKey) {
                return $deadline;
            }
        }

        return null;
    }
}
