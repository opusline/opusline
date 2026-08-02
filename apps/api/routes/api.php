<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

Route::get('/ping', function () {
    return response()->json(['status' => 'ok']);
});
