<?php

declare(strict_types=1);

use App\Http\Invoices\Controllers\InvoiceController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/invoices', [InvoiceController::class, 'index'])
        ->name('listInvoices');
    Route::post('/invoices', [InvoiceController::class, 'store'])
        ->name('createInvoice');

    // Declared before the {invoice} routes only for readability — what actually keeps
    // them apart is the whereNumber constraint below.
    Route::get('/invoices/next-number', [InvoiceController::class, 'nextNumber'])
        ->name('showNextInvoiceNumber');

    Route::get('/invoices/{invoice}', [InvoiceController::class, 'show'])
        ->whereNumber('invoice')
        ->name('showInvoice');
    Route::put('/invoices/{invoice}', [InvoiceController::class, 'update'])
        ->whereNumber('invoice')
        ->name('updateInvoice');
    Route::delete('/invoices/{invoice}', [InvoiceController::class, 'destroy'])
        ->whereNumber('invoice')
        ->name('deleteInvoice');

    Route::post('/invoices/{invoice}/send', [InvoiceController::class, 'send'])
        ->whereNumber('invoice')
        ->name('sendInvoice');
    Route::post('/invoices/{invoice}/pay', [InvoiceController::class, 'pay'])
        ->whereNumber('invoice')
        ->name('payInvoice');
    Route::post('/invoices/{invoice}/reminders', [InvoiceController::class, 'remind'])
        ->whereNumber('invoice')
        ->name('remindInvoice');
});
