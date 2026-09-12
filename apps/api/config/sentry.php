<?php

declare(strict_types=1);

/*
|--------------------------------------------------------------------------
| Sentry
|--------------------------------------------------------------------------
|
| The PHP SDK's options; a key left out keeps the package default. The
| browser app's DSN lives in config/services.php, not here.
|
*/

return [

    // Empty means off: no transport is built and nothing else changes.
    'dsn' => env('SENTRY_LARAVEL_DSN'),

    // The stamped release, so an event points at the build that raised it.
    'release' => env('SENTRY_RELEASE', config('app.version')),

    // Empty falls back to APP_ENV.
    'environment' => env('SENTRY_ENVIRONMENT'),

    // A single-user instance sees a few hundred requests a day: trace them
    // all. Profiling stays off — the image ships no excimer extension.
    'traces_sample_rate' => (float) env('SENTRY_TRACES_SAMPLE_RATE', 1.0),

    // Request bodies carry passwords and invoice figures; nothing in an
    // event needs them.
    'send_default_pii' => false,
    'max_request_body_size' => 'never',

    // Probes read nothing, and the SPA pings on every boot: not worth a trace.
    'ignore_transactions' => [
        '/up',
        '/api/ping',
    ],

    'breadcrumbs' => [
        'sql_bindings' => false,
    ],

    'tracing' => [
        // Full SQL on every db span is what Sentry's N+1 detector reads; the
        // bindings stay out so a trace never carries a client's data.
        'sql_queries' => true,
        'sql_bindings' => false,
        'sql_origin' => true,

        // On in the package's published file but off in its code defaults, and
        // the queue:work container is where the rates and PDF jobs run.
        'queue_job_transactions' => true,
        'queue_jobs' => true,
    ],

];
