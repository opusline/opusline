<?php

declare(strict_types=1);

namespace App\Domain\Feedback\Actions;

use App\Domain\Feedback\Data\RelayedIssueData;
use App\Domain\Feedback\Data\RelayReportData;
use App\Domain\Feedback\Relay\GitHubApp;
use App\Domain\Feedback\Relay\ProofOfWork;
use App\Domain\Feedback\Relay\RelayChallenge;
use Illuminate\Http\Client\RequestException;
use Illuminate\Validation\ValidationException;

/**
 * Files a report an instance sent: refused when the sender is blocklisted or
 * its proof of work does not hold, otherwise opened on the repository with a
 * footer saying where it came from, so maintainers can filter and block.
 */
class FileRelayedReport
{
    public function __construct(private readonly GitHubApp $gitHubApp) {}

    public function handle(RelayReportData $report, string $ip): RelayedIssueData
    {
        $blocklist = config()->array('relay.blocklist');
        abort_if(in_array($report->instanceId, $blocklist, true) || in_array($ip, $blocklist, true), 403, __('feedback.relay_blocked'));

        if (! ProofOfWork::satisfies($report->challenge, $report->nonce, config()->integer('relay.difficulty')) || ! RelayChallenge::spend($report->challenge)) {
            throw ValidationException::withMessages(['nonce' => __('feedback.relay_proof_refused')]);
        }

        try {
            $issue = $this->gitHubApp->createIssue(
                trim($report->title),
                trim($report->body)."\n\n---\n".sprintf('Reported from Opusline %s via the in-app reporter · instance `%s`', $report->version, $report->instanceId),
                $report->kind->issueType(),
            );
        } catch (RequestException $exception) {
            report($exception);
            abort(502, __('feedback.relay_github_failed'));
        }

        return new RelayedIssueData(number: $issue['number'], url: $issue['url']);
    }
}
