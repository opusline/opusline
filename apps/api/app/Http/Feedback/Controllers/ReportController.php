<?php

declare(strict_types=1);

namespace App\Http\Feedback\Controllers;

use App\Domain\Feedback\Actions\ContinueReportConversation;
use App\Domain\Feedback\Actions\SendReport;
use App\Domain\Feedback\Data\RelayedIssueData;
use App\Domain\Feedback\Data\ReportConversationData;
use App\Domain\Feedback\Data\ReportData;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;

class ReportController extends Controller
{
    /** One turn of the conversation in which Claude drafts the report with the account. */
    public function converse(ReportConversationData $data, #[CurrentUser] User $user, ContinueReportConversation $continueReportConversation): JsonResponse
    {
        // A 200, not the 201 a returned Data gets on POST: a turn creates nothing.
        return response()->json($continueReportConversation->handle($user, $data));
    }

    /** Files the account's bug report or feature request on the project's tracker. */
    public function store(ReportData $data, SendReport $sendReport): JsonResponse
    {
        return response()->json(RelayedIssueData::from($sendReport->handle($data)), 201);
    }
}
