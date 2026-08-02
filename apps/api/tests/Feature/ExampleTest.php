<?php

declare(strict_types=1);

test('the application health check returns a successful response', function (): void {
    $response = $this->get('/up');

    $response->assertSuccessful();
});
