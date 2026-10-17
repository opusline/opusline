<?php

declare(strict_types=1);

use App\Http\Features\Support\EnsureFeatureIsActive;
use App\Http\Invoices\Controllers\CatalogItemController;
use App\Http\Invoices\Controllers\EmailTemplateController;
use App\Http\Invoices\Controllers\ExternalQuoteController;
use App\Http\Invoices\Controllers\InvoiceController;
use App\Http\Invoices\Controllers\InvoiceDraftController;
use App\Http\Invoices\Controllers\InvoicePaperController;
use App\Http\Invoices\Controllers\InvoicingSettingsController;
use App\Http\Invoices\Controllers\QuoteController;
use App\Http\Invoices\Controllers\QuoteDocumentController;
use App\Http\Invoices\Controllers\QuoteDraftController;
use App\Http\Invoices\Controllers\QuoteInvoiceController;
use App\Http\Invoices\Controllers\QuotePaperController;
use App\Http\Users\Support\EnsureMailIsEnabled;
use App\Http\Users\Support\EnsureSessionIsUnlocked;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', EnsureSessionIsUnlocked::class])->group(function (): void {
    // Writing invoices in Opusline is still in beta: these answer 404 until the
    // account (or the instance) has the flag.
    Route::middleware(EnsureFeatureIsActive::class.':invoicing')->group(function (): void {
        Route::get('/invoicing/settings', [InvoicingSettingsController::class, 'show'])
            ->name('showInvoicingSettings');
        Route::put('/invoicing/settings', [InvoicingSettingsController::class, 'update'])
            ->name('updateInvoicingSettings');

        Route::post('/invoicing/invoices', [InvoiceDraftController::class, 'store'])
            ->name('createInvoiceDraft');
        Route::put('/invoicing/invoices/{invoice}', [InvoiceDraftController::class, 'update'])
            ->whereNumber('invoice')
            ->name('updateInvoiceDraft');
        Route::get('/invoicing/unbilled-time', [InvoiceDraftController::class, 'unbilledTime'])
            ->name('showUnbilledTime');
        Route::post('/invoicing/invoices/paper', [InvoicePaperController::class, 'preview'])
            ->name('previewInvoicePaper');
        Route::get('/invoices/{invoice}/paper', [InvoicePaperController::class, 'show'])
            ->whereNumber('invoice')
            ->name('showInvoicePaper');
        Route::get('/invoices/{invoice}/pdf', [InvoicePaperController::class, 'pdf'])
            ->whereNumber('invoice')
            ->name('downloadInvoicePdf');
        Route::post('/invoicing/invoices/{invoice}/issue', [InvoiceDraftController::class, 'issue'])
            ->whereNumber('invoice')
            ->name('issueInvoice');

        Route::get('/invoicing/quotes', [QuoteController::class, 'index'])
            ->name('listQuotes');
        Route::post('/invoicing/quotes', [QuoteDraftController::class, 'store'])
            ->name('createQuoteDraft');
        Route::post('/invoicing/quotes/paper', [QuotePaperController::class, 'preview'])
            ->name('previewQuotePaper');
        Route::post('/invoicing/quotes/external', [ExternalQuoteController::class, 'store'])
            ->name('createExternalQuote');
        Route::get('/invoicing/quotes/{quote}', [QuoteController::class, 'show'])
            ->whereNumber('quote')
            ->name('showQuote');
        Route::put('/invoicing/quotes/{quote}', [QuoteDraftController::class, 'update'])
            ->whereNumber('quote')
            ->name('updateQuoteDraft');
        Route::delete('/invoicing/quotes/{quote}', [QuoteController::class, 'destroy'])
            ->whereNumber('quote')
            ->name('deleteQuote');
        Route::post('/invoicing/quotes/{quote}/issue', [QuoteDraftController::class, 'issue'])
            ->whereNumber('quote')
            ->name('issueQuote');
        Route::post('/invoicing/quotes/{quote}/accept', [QuoteDraftController::class, 'accept'])
            ->whereNumber('quote')
            ->name('acceptQuote');
        Route::post('/invoicing/quotes/{quote}/refuse', [QuoteDraftController::class, 'refuse'])
            ->whereNumber('quote')
            ->name('refuseQuote');
        Route::post('/invoicing/quotes/{quote}/reopen', [QuoteDraftController::class, 'reopen'])
            ->whereNumber('quote')
            ->name('reopenQuote');
        Route::post('/invoicing/quotes/{quote}/invoices', [QuoteInvoiceController::class, 'store'])
            ->whereNumber('quote')
            ->name('createQuoteInvoice');
        Route::post('/invoicing/quotes/{quote}/document', [QuoteDocumentController::class, 'store'])
            ->whereNumber('quote')
            ->middleware('throttle:uploads')
            ->name('uploadQuoteDocument');
        Route::delete('/invoicing/quotes/{quote}/document', [QuoteDocumentController::class, 'destroy'])
            ->whereNumber('quote')
            ->name('deleteQuoteDocument');
        Route::get('/invoicing/quotes/{quote}/paper', [QuotePaperController::class, 'show'])
            ->whereNumber('quote')
            ->name('showQuotePaper');
        Route::get('/invoicing/quotes/{quote}/pdf', [QuotePaperController::class, 'pdf'])
            ->whereNumber('quote')
            ->name('downloadQuotePdf');

        Route::get('/invoicing/emails', [EmailTemplateController::class, 'index'])
            ->name('listEmailTemplates');
        Route::put('/invoicing/emails/reminders', [EmailTemplateController::class, 'updateReminderDefaults'])
            ->name('updateReminderDefaults');
        Route::put('/invoicing/emails/{kind}', [EmailTemplateController::class, 'update'])
            ->whereNumber('kind')
            ->name('updateEmailTemplate');
        Route::delete('/invoicing/emails/{kind}', [EmailTemplateController::class, 'destroy'])
            ->whereNumber('kind')
            ->name('resetEmailTemplate');
        Route::post('/invoicing/emails/{kind}/preview', [EmailTemplateController::class, 'preview'])
            ->whereNumber('kind')
            ->name('previewEmailTemplate');
        Route::post('/invoicing/emails/{kind}/test', [EmailTemplateController::class, 'test'])
            ->whereNumber('kind')
            ->middleware([EnsureMailIsEnabled::class, 'throttle:mail-test'])
            ->name('testEmailTemplate');
        Route::get('/invoicing/catalog', [CatalogItemController::class, 'index'])
            ->name('listCatalogItems');
        Route::post('/invoicing/catalog', [CatalogItemController::class, 'store'])
            ->name('createCatalogItem');
        Route::put('/invoicing/catalog/{catalogItem}', [CatalogItemController::class, 'update'])
            ->whereNumber('catalogItem')
            ->name('updateCatalogItem');
        Route::delete('/invoicing/catalog/{catalogItem}', [CatalogItemController::class, 'destroy'])
            ->whereNumber('catalogItem')
            ->name('deleteCatalogItem');
    });

    Route::get('/invoices', [InvoiceController::class, 'index'])
        ->name('listInvoices');
    Route::post('/invoices', [InvoiceController::class, 'store'])
        ->name('createInvoice');

    // Declared before the {invoice} routes only for readability — what actually keeps
    // them apart is the whereNumber constraint below.
    Route::get('/invoices/summary', [InvoiceController::class, 'summary'])
        ->name('showInvoiceSummary');
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
