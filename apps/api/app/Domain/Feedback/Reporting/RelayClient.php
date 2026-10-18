<?php

declare(strict_types=1);

namespace App\Domain\Feedback\Reporting;

use App\Domain\Feedback\Data\RelayedIssueData;
use App\Domain\Feedback\Enums\ReportKind;
use App\Domain\Feedback\Relay\ProofOfWork;
use Closure;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

/**
 * Hands a report to the relay: asks for a challenge, solves it here, then
 * posts the report with the nonce. The relay's routes are in routes/api/relay.php.
 */
class RelayClient
{
    /** Kept on by the instance, with a relay to send to. */
    public static function isConfigured(): bool
    {
        return config()->boolean('reports.enabled') && filled(config('reports.relay_url'));
    }

    /** @throws ReportNotDelivered */
    public function send(ReportKind $kind, string $title, string $body): RelayedIssueData
    {
        $challenge = $this->call(fn (PendingRequest $relay): Response => $relay->get('/api/relay/challenge'));
        $puzzle = $challenge->json('challenge');
        $difficulty = $challenge->json('difficulty');

        if (! is_string($puzzle) || ! is_int($difficulty)) {
            throw ReportNotDelivered::because('The relay answered a challenge of an unexpected shape.');
        }

        if ($difficulty > config()->integer('reports.max_difficulty')) {
            throw ReportNotDelivered::because("The relay asked for a {$difficulty}-bit proof of work, more than this instance spends.");
        }

        $filed = $this->call(fn (PendingRequest $relay): Response => $relay->post('/api/relay/reports', [
            'kind' => $kind->value,
            'title' => $title,
            'body' => $body,
            'instanceId' => InstanceId::current(),
            'version' => config()->string('app.version'),
            'challenge' => $puzzle,
            'nonce' => ProofOfWork::solve($puzzle, $difficulty),
        ]));
        $number = $filed->json('number');
        $url = $filed->json('url');

        if (! is_int($number) || ! is_string($url)) {
            throw ReportNotDelivered::because('The relay answered a filed issue of an unexpected shape.');
        }

        return new RelayedIssueData(number: $number, url: $url);
    }

    /**
     * @param  Closure(PendingRequest): Response  $request
     *
     * @throws ReportNotDelivered
     */
    private function call(Closure $request): Response
    {
        $relay = Http::baseUrl(config()->string('reports.relay_url'))
            ->timeout(config()->integer('reports.timeout_seconds'))
            ->acceptJson();

        try {
            $response = $request($relay);
        } catch (ConnectionException $exception) {
            throw ReportNotDelivered::because('Could not reach the relay.', $exception);
        }

        if ($response->status() === 429) {
            throw ReportNotDelivered::relayBusy();
        }

        if ($response->failed()) {
            throw ReportNotDelivered::because("The relay answered {$response->status()}: ".Str::limit($response->body(), 500));
        }

        return $response;
    }
}
