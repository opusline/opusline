<?php

declare(strict_types=1);

namespace App\Http\Feedback\Controllers;

use App\Domain\Feedback\Actions\SendReport;
use App\Domain\Feedback\Data\RelayedIssueData;
use App\Domain\Feedback\Data\ReportData;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class ReportController extends Controller
{
    /** Files the account's bug report or feature request on the project's tracker. */
    public function store(ReportData $data, SendReport $sendReport): JsonResponse
    {
        return response()->json(RelayedIssueData::from($sendReport->handle($data)), 201);
    }
}
