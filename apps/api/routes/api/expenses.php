<?php

declare(strict_types=1);

use App\Http\Expenses\Controllers\ExpenseController;
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

    Route::put('/expenses/{expense}', [ExpenseController::class, 'update'])
        ->whereNumber('expense')
        ->name('updateExpense');

    Route::delete('/expenses/{expense}', [ExpenseController::class, 'destroy'])
        ->whereNumber('expense')
        ->name('deleteExpense');
});
