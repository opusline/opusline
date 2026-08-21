<?php

declare(strict_types=1);

namespace App\Http\Bank\Controllers;

use App\Domain\Bank\Actions\DeletePersonalTransfer;
use App\Domain\Bank\Actions\RecordPersonalTransfer;
use App\Domain\Bank\Actions\SummarizeTreasury;
use App\Domain\Bank\Data\CreatePersonalTransferData;
use App\Domain\Bank\Models\PersonalTransfer;
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

    public function storeTransfer(
        CreatePersonalTransferData $data,
        #[CurrentUser] User $user,
        RecordPersonalTransfer $recordPersonalTransfer,
        SummarizeTreasury $summarizeTreasury,
    ): JsonResponse {
        $recordPersonalTransfer->handle($user, $data);

        return response()->json($summarizeTreasury->handle($user), 201);
    }

    // Answers with the recomputed treasury rather than a 204: the whole screen
    // is one figure, and deleting a transfer moves it.
    public function destroyTransfer(
        PersonalTransfer $transfer,
        #[CurrentUser] User $user,
        DeletePersonalTransfer $deletePersonalTransfer,
        SummarizeTreasury $summarizeTreasury,
    ): JsonResponse {
        $deletePersonalTransfer->handle($transfer);

        return response()->json($summarizeTreasury->handle($user));
    }
}
