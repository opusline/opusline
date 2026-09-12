<?php

declare(strict_types=1);

use App\Http\Expenses\Controllers\ExpenseController;
use App\Http\Expenses\Controllers\ExpenseReceiptController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/expenses', [ExpenseController::class, 'index'])
        ->name('listExpenses');

    Route::post('/expenses', [ExpenseController::class, 'store'])
        ->name('createExpense');

    // Declared before the {expense} routes so the literal segment never reads
    // as an id; whereNumber below is what actually keeps them apart.
    Route::post('/expenses/category', [ExpenseController::class, 'recategorize'])
        ->name('recategorizeExpenses');

    Route::post('/expenses/vat-deferrals', [ExpenseController::class, 'deferVat'])
        ->name('deferExpensesVat');

    Route::delete('/expenses/{expense}/vat-deferral', [ExpenseController::class, 'reintegrateVat'])
        ->whereNumber('expense')
        ->name('reintegrateExpenseVat');

    Route::put('/expenses/{expense}', [ExpenseController::class, 'update'])
        ->whereNumber('expense')
        ->name('updateExpense');

    Route::delete('/expenses/{expense}', [ExpenseController::class, 'destroy'])
        ->whereNumber('expense')
        ->name('deleteExpense');

    Route::post('/expenses/{expense}/receipt', [ExpenseReceiptController::class, 'store'])
        ->whereNumber('expense')
        ->middleware('throttle:uploads')
        ->name('attachExpenseReceipt');

    Route::get('/expenses/{expense}/receipt', [ExpenseReceiptController::class, 'show'])
        ->whereNumber('expense')
        ->name('downloadExpenseReceipt');

    Route::delete('/expenses/{expense}/receipt', [ExpenseReceiptController::class, 'destroy'])
        ->whereNumber('expense')
        ->name('detachExpenseReceipt');
});
