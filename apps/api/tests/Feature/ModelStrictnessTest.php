<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\MissingAttributeException;
use Illuminate\Database\LazyLoadingViolationException;

test('strict models throw when accessing a missing attribute', function (): void {
    $user = User::factory()->create()->fresh();

    expect(fn () => $user->attribute_that_does_not_exist)
        ->toThrow(MissingAttributeException::class);
});

// Laravel only arms lazy-loading prevention on models hydrated as part of a
// multi-row result: a lone fetch cannot be an N+1, so the tests query a pair.
function firstOfTwoClients(): Client
{
    Client::factory()->count(2)->for(User::factory()->create())->create();

    return Client::query()->get()->firstOrFail();
}

test('a lazy load throws outside production', function (): void {
    $client = firstOfTwoClients();

    expect(fn () => $client->missions)->toThrow(LazyLoadingViolationException::class);
});

test('a lazy load in production is served instead of thrown', function (): void {
    $this->app['env'] = 'production';

    $client = firstOfTwoClients();

    expect($client->missions)->toBeInstanceOf(Collection::class);
});
