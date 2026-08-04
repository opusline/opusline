<?php

declare(strict_types=1);

test('the api responds to ping with a json payload', function (): void {
    $response = $this->getJson('/api/ping');

    $response->assertSuccessful();
    $response->assertJson(['status' => 'ok', 'version' => config('app.version')]);
});
