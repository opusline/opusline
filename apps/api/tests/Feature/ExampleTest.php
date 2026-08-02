<?php

test('the application health check returns a successful response', function () {
    $response = $this->get('/up');

    $response->assertSuccessful();
});
