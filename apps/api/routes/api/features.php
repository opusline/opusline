<?php

declare(strict_types=1);

use App\Http\Features\Controllers\BetaFeatureController;
use App\Http\Users\Support\EnsureSessionIsUnlocked;
use App\Http\Users\Support\RefuseAccessTokens;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', EnsureSessionIsUnlocked::class, RefuseAccessTokens::class])->group(function (): void {
    Route::get('/user/features', [BetaFeatureController::class, 'index'])
        ->name('listBetaFeatures');
    Route::put('/user/features/{feature}', [BetaFeatureController::class, 'update'])
        ->where('feature', '[a-z0-9_-]+')
        ->name('chooseBetaFeature');
});
