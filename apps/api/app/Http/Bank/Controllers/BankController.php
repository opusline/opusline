<?php

declare(strict_types=1);

namespace App\Http\Bank\Controllers;

use App\Domain\Bank\Actions\DismissBankMatch;
use App\Domain\Bank\Actions\ImportBankStatement;
use App\Domain\Bank\Actions\ListBankMovements;
use App\Domain\Bank\Actions\SummarizeBankAccount;
use App\Domain\Bank\Actions\UpdateBankBalance;
use App\Domain\Bank\Actions\ValidateBankMatch;
use App\Domain\Bank\Data\BankMovementPageData;
use App\Domain\Bank\Data\ImportBankStatementData;
use App\Domain\Bank\Data\ListBankMovementsData;
use App\Domain\Bank\Data\UpdateBankBalanceData;
use App\Domain\Bank\Models\BankMatch;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;

class BankController extends Controller
{
    public function show(#[CurrentUser] User $user, SummarizeBankAccount $summarizeBankAccount): JsonResponse
    {
        return response()->json($summarizeBankAccount->handle($user));
    }

    public function movements(
        ListBankMovementsData $data,
        #[CurrentUser] User $user,
        ListBankMovements $listBankMovements,
    ): JsonResponse {
        ['movements' => $movements, 'nextCursor' => $nextCursor] = $listBankMovements->handle($user, $data->cursor);

        return response()->json(new BankMovementPageData(movements: $movements, nextCursor: $nextCursor));
    }

    public function updateBalance(
        UpdateBankBalanceData $data,
        #[CurrentUser] User $user,
        UpdateBankBalance $updateBankBalance,
        SummarizeBankAccount $summarizeBankAccount,
    ): JsonResponse {
        $updateBankBalance->handle($user, $data);

        return response()->json($summarizeBankAccount->handle($user));
    }

    public function importStatement(
        ImportBankStatementData $data,
        #[CurrentUser] User $user,
        ImportBankStatement $importBankStatement,
    ): JsonResponse {
        return response()->json($importBankStatement->handle($user, $data), 201);
    }

    public function validateMatch(
        BankMatch $match,
        #[CurrentUser] User $user,
        ValidateBankMatch $validateBankMatch,
        SummarizeBankAccount $summarizeBankAccount,
    ): JsonResponse {
        $validateBankMatch->handle($match);

        return response()->json($summarizeBankAccount->handle($user));
    }

    public function dismissMatch(
        BankMatch $match,
        #[CurrentUser] User $user,
        DismissBankMatch $dismissBankMatch,
        SummarizeBankAccount $summarizeBankAccount,
    ): JsonResponse {
        $dismissBankMatch->handle($match);

        return response()->json($summarizeBankAccount->handle($user));
    }
}
