<?php

declare(strict_types=1);

namespace App\Http\Expenses\Controllers;

use App\Domain\Expenses\Actions\CreateExpense;
use App\Domain\Expenses\Actions\DeferVatDeductions;
use App\Domain\Expenses\Actions\DeleteExpense;
use App\Domain\Expenses\Actions\LinkExpenseBankMovement;
use App\Domain\Expenses\Actions\ListExpenses;
use App\Domain\Expenses\Actions\RecategorizeExpenses;
use App\Domain\Expenses\Actions\ReintegrateVatDeduction;
use App\Domain\Expenses\Actions\UnlinkExpenseBankMovement;
use App\Domain\Expenses\Actions\UpdateExpense;
use App\Domain\Expenses\Data\ExpenseInputData;
use App\Domain\Expenses\Data\ExpenseSelectionData;
use App\Domain\Expenses\Data\LinkExpenseBankMovementData;
use App\Domain\Expenses\Data\ListExpensesData;
use App\Domain\Expenses\Data\RecategorizeExpensesData;
use App\Domain\Expenses\Models\Expense;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class ExpenseController extends Controller
{
    public function index(ListExpensesData $data, #[CurrentUser] User $user, ListExpenses $listExpenses): JsonResponse
    {
        return response()->json($listExpenses->handle($user, $data->month));
    }

    public function store(
        ExpenseInputData $data,
        #[CurrentUser] User $user,
        CreateExpense $createExpense,
        ListExpenses $listExpenses,
    ): JsonResponse {
        $expense = $createExpense->handle($user, $data);

        return response()->json($listExpenses->handle($user, $expense->month()), 201);
    }

    public function update(
        ExpenseInputData $data,
        #[CurrentUser] User $user,
        Expense $expense,
        UpdateExpense $updateExpense,
        ListExpenses $listExpenses,
    ): JsonResponse {
        $updateExpense->handle($expense, $data);

        return response()->json($listExpenses->handle($user, $expense->month()));
    }

    public function storeBankMovement(
        LinkExpenseBankMovementData $data,
        #[CurrentUser] User $user,
        Expense $expense,
        LinkExpenseBankMovement $linkExpenseBankMovement,
        ListExpenses $listExpenses,
    ): JsonResponse {
        $linkExpenseBankMovement->handle($expense, $data);

        return response()->json($listExpenses->handle($user, $expense->month()), 201);
    }

    public function destroyBankMovement(
        #[CurrentUser] User $user,
        Expense $expense,
        UnlinkExpenseBankMovement $unlinkExpenseBankMovement,
        ListExpenses $listExpenses,
    ): JsonResponse {
        $unlinkExpenseBankMovement->handle($expense);

        return response()->json($listExpenses->handle($user, $expense->month()));
    }

    public function destroy(Expense $expense, DeleteExpense $deleteExpense): Response
    {
        $deleteExpense->handle($expense);

        return response()->noContent();
    }

    public function recategorize(
        RecategorizeExpensesData $data,
        #[CurrentUser] User $user,
        RecategorizeExpenses $recategorizeExpenses,
        ListExpenses $listExpenses,
    ): JsonResponse {
        $month = $recategorizeExpenses->handle($user, $data);

        return response()->json($listExpenses->handle($user, $month));
    }

    public function deferVat(
        ExpenseSelectionData $data,
        #[CurrentUser] User $user,
        DeferVatDeductions $deferVatDeductions,
        ListExpenses $listExpenses,
    ): JsonResponse {
        $month = $deferVatDeductions->handle($user, $data);

        return response()->json($listExpenses->handle($user, $month));
    }

    public function reintegrateVat(
        #[CurrentUser] User $user,
        Expense $expense,
        ReintegrateVatDeduction $reintegrateVatDeduction,
        ListExpenses $listExpenses,
    ): JsonResponse {
        $reintegrateVatDeduction->handle($expense);

        return response()->json($listExpenses->handle($user, $expense->month()));
    }
}
