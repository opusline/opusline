<?php

declare(strict_types=1);

test('the horizon dashboard denies guests outside the local environment', function (): void {
    $response = $this->get('/horizon');

    $response->assertForbidden();
});
