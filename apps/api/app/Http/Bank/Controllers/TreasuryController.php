<?php

declare(strict_types=1);

namespace App\Http\Bank\Controllers;

use App\Domain\Bank\Actions\RecordTreasuryTransfer;
use App\Domain\Bank\Actions\SummarizeTreasury;
use App\Domain\Bank\Data\RecordTreasuryTransferData;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;

class TreasuryController extends Controller
{
    public function show(#[CurrentUser] User $user, SummarizeTreasury $summarizeTreasury): JsonResponse
    {
        return response()->json($summarizeTreasury->handle($user));
    }

    /**
     * Answers with the whole screen rather than the created row: recording a
     * transfer moves the figure the page exists to show.
     */
    public function store(
        RecordTreasuryTransferData $data,
        #[CurrentUser] User $user,
        RecordTreasuryTransfer $recordTreasuryTransfer,
        SummarizeTreasury $summarizeTreasury,
    ): JsonResponse {
        $recordTreasuryTransfer->handle($user, $data);

        return response()->json($summarizeTreasury->handle($user), 201);
    }
}
