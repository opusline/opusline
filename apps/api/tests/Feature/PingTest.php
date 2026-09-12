<?php

declare(strict_types=1);

test('the api responds to ping with a json payload', function (): void {
    $response = $this->getJson('/api/ping');

    $response->assertSuccessful();
    $response->assertJson(['status' => 'ok', 'version' => config('app.version')]);
});

test('ping hands the browser app its sentry project when one is configured', function (): void {
    config()->set('services.sentry.web_dsn', 'https://public@sentry.example/1');
    config()->set('services.sentry.web_traces_sample_rate', 0.25);
    config()->set('sentry.environment', 'staging');

    $this->getJson('/api/ping')
        ->assertOk()
        ->assertJsonPath('sentry.dsn', 'https://public@sentry.example/1')
        ->assertJsonPath('sentry.environment', 'staging')
        ->assertJsonPath('sentry.tracesSampleRate', 0.25);
});

test('ping falls back to the app environment when sentry has none', function (): void {
    config()->set('services.sentry.web_dsn', 'https://public@sentry.example/1');
    config()->set('sentry.environment', '');

    $this->getJson('/api/ping')->assertOk()->assertJsonPath('sentry.environment', 'testing');
});

test('ping reports no sentry project when none is configured', function (): void {
    config()->set('services.sentry.web_dsn', '');

    $this->getJson('/api/ping')->assertOk()->assertJsonPath('sentry', null);
});
