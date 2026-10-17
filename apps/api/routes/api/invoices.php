<?php

declare(strict_types=1);

use App\Domain\AccessTokens\Enums\TokenAbility;
use App\Http\Invoices\Controllers\InvoiceController;
use App\Http\Users\Support\EnsureSessionIsUnlocked;
use App\Http\Users\Support\RefuseAccessTokens;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Middleware\CheckAbilities;

Route::middleware(['auth:sanctum', EnsureSessionIsUnlocked::class])->group(function (): void {
    // The two reads a personal access token may make — the only routes in the
    // API that take one. A cookie session passes the ability check as well.
    Route::middleware(CheckAbilities::class.':'.TokenAbility::ReadInvoices->value)->group(function (): void {
        Route::get('/invoices', [InvoiceController::class, 'index'])
            ->name('listInvoices');
        // Kept apart from /invoices/summary and /invoices/next-number below by
        // the whereNumber constraint, not by declaration order.
        Route::get('/invoices/{invoice}', [InvoiceController::class, 'show'])
            ->whereNumber('invoice')
            ->name('showInvoice');
    });

    Route::middleware(RefuseAccessTokens::class)->group(function (): void {
        Route::post('/invoices', [InvoiceController::class, 'store'])
            ->name('createInvoice');

        Route::get('/invoices/summary', [InvoiceController::class, 'summary'])
            ->name('showInvoiceSummary');
        Route::get('/invoices/next-number', [InvoiceController::class, 'nextNumber'])
            ->name('showNextInvoiceNumber');

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

        // PATCH, not another PUT on the invoice: this touches the two dates the
        // lifecycle wrote and nothing else, so a correction never has to resend the
        // amounts it is not changing.
        Route::patch('/invoices/{invoice}/dates', [InvoiceController::class, 'correctDates'])
            ->whereNumber('invoice')
            ->name('correctInvoiceDates');

        // One document per invoice, so the path names the invoice's document rather
        // than a member of a collection it does not have.
        Route::post('/invoices/{invoice}/document', [InvoiceController::class, 'storeDocument'])
            ->whereNumber('invoice')
            ->middleware('throttle:uploads')
            ->name('uploadInvoiceDocument');
        Route::get('/invoices/{invoice}/document', [InvoiceController::class, 'downloadDocument'])
            ->whereNumber('invoice')
            ->name('downloadInvoiceDocument');
        Route::delete('/invoices/{invoice}/document', [InvoiceController::class, 'destroyDocument'])
            ->whereNumber('invoice')
            ->name('deleteInvoiceDocument');
    });
});
