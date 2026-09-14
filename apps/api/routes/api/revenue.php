<?php

declare(strict_types=1);

use App\Http\Invoices\Controllers\ClientRevenueController;
use App\Http\Invoices\Controllers\RevenueController;
use App\Http\Users\Support\EnsureSessionIsUnlocked;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', EnsureSessionIsUnlocked::class])->group(function (): void {
    Route::get('/revenue', [RevenueController::class, 'show'])
        ->name('showRevenue');
    Route::get('/client-revenue', [ClientRevenueController::class, 'index'])
        ->name('listClientRevenue');
});
