<?php

declare(strict_types=1);

use App\Domain\Settings\Rates\RatesUnavailable;
use App\Http\Users\Support\ThemeCookie;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->statefulApi();
        $middleware->throttleApi();

        $middleware->encryptCookies(except: [ThemeCookie::NAME]);
    })
    ->withSchedule(function (Schedule $schedule): void {
        $schedule->command('rates:refresh')->dailyAt('03:00')->withoutOverlapping();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(fn (): true => true);

        $exceptions->render(fn (RatesUnavailable $exception) => response()->json(
            ['message' => __('settings.rates_unavailable')],
            503,
        ));
    })->create();
