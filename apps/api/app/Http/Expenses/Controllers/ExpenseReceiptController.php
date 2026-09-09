<?php

declare(strict_types=1);

namespace App\Http\Expenses\Controllers;

use App\Domain\Expenses\Actions\AttachExpenseReceipt;
use App\Domain\Expenses\Actions\DetachExpenseReceipt;
use App\Domain\Expenses\Actions\ListExpenses;
use App\Domain\Expenses\Data\UploadExpenseReceiptData;
use App\Domain\Expenses\Models\Expense;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Support\StreamsMedia;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExpenseReceiptController extends Controller
{
    use StreamsMedia;

    public function store(
        UploadExpenseReceiptData $data,
        #[CurrentUser] User $user,
        Expense $expense,
        AttachExpenseReceipt $attachExpenseReceipt,
        ListExpenses $listExpenses,
    ): JsonResponse {
        $attachExpenseReceipt->handle($expense, $data);

        return response()->json($listExpenses->handle($user, $expense->month()), 201);
    }

    public function show(Expense $expense): StreamedResponse
    {
        return $this->streamSingleFile($expense, Expense::RECEIPT_COLLECTION);
    }

    public function destroy(
        #[CurrentUser] User $user,
        Expense $expense,
        DetachExpenseReceipt $detachExpenseReceipt,
        ListExpenses $listExpenses,
    ): JsonResponse {
        $detachExpenseReceipt->handle($expense);

        return response()->json($listExpenses->handle($user, $expense->month()));
    }
}
