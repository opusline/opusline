<?php

declare(strict_types=1);

namespace App\Domain\Feedback\Actions;

use App\Domain\Feedback\Data\RelayedIssueData;
use App\Domain\Feedback\Data\ReportContextData;
use App\Domain\Feedback\Data\ReportData;
use App\Domain\Feedback\Reporting\RelayClient;
use App\Domain\Feedback\Reporting\ReportNotDelivered;

/** Sends an account's report to the relay, with the context it agreed to share. */
class SendReport
{
    public function __construct(private readonly RelayClient $relayClient) {}

    public function handle(ReportData $report): RelayedIssueData
    {
        $body = trim($report->body);

        if ($report->context instanceof ReportContextData) {
            $body .= "\n\n".$this->describe($report->context);
        }

        try {
            return $this->relayClient->send($report->kind, trim($report->title), $body);
        } catch (ReportNotDelivered $exception) {
            abort_if($exception->isRelayBusy, 429, __('feedback.report_relay_busy'));
            report($exception);
            abort(502, __('feedback.report_not_delivered'));
        }
    }

    private function describe(ReportContextData $context): string
    {
        // Inline code keeps the values literal; a backtick would end it early.
        $literal = static fn (string $value): string => '`'.str_replace('`', '', $value).'`';

        return implode("\n", [
            '<details><summary>Context</summary>',
            '',
            '- Route: '.$literal($context->route),
            '- Browser: '.$literal($context->browser),
            '- Locale: '.$literal($context->locale),
            '',
            '</details>',
        ]);
    }
}
