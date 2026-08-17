<?php

declare(strict_types=1);

use App\Http\Invoices\Controllers\ClientRevenueController;
use App\Http\Invoices\Controllers\RevenueController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/revenue', [RevenueController::class, 'show'])
        ->name('showRevenue');
    Route::get('/client-revenue', [ClientRevenueController::class, 'index'])
        ->name('listClientRevenue');
});
