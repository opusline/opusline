<?php

test('the api responds to ping with a json payload', function () {
    $response = $this->getJson('/api/ping');

    $response->assertSuccessful();
    $response->assertJson(['status' => 'ok']);
});
