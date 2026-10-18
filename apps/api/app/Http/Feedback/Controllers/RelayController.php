<?php

declare(strict_types=1);

namespace App\Http\Feedback\Controllers;

use App\Domain\Feedback\Actions\FileRelayedReport;
use App\Domain\Feedback\Data\RelayChallengeData;
use App\Domain\Feedback\Data\RelayedIssueData;
use App\Domain\Feedback\Data\RelayReportData;
use App\Domain\Feedback\Relay\RelayChallenge;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RelayController extends Controller
{
    /** A fresh puzzle to solve before sending one report. */
    public function challenge(): RelayChallengeData
    {
        $challenge = RelayChallenge::issue();

        return new RelayChallengeData(
            challenge: $challenge,
            difficulty: config()->integer('relay.difficulty'),
            expiresAt: RelayChallenge::expiresAt($challenge),
        );
    }

    /** Files a report another instance sent as an issue on the repository. */
    public function store(RelayReportData $data, Request $request, FileRelayedReport $fileRelayedReport): JsonResponse
    {
        return response()->json(RelayedIssueData::from($fileRelayedReport->handle($data, (string) $request->ip())), 201);
    }
}
