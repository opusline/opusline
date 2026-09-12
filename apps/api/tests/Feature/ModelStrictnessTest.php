<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\MissingAttributeException;
use Illuminate\Database\LazyLoadingViolationException;
use Sentry\ClientBuilder;
use Sentry\Event;
use Sentry\SentrySdk;
use Sentry\State\Hub;
use Sentry\Transport\Result;
use Sentry\Transport\ResultStatus;
use Sentry\Transport\TransportInterface;

test('strict models throw when accessing a missing attribute', function (): void {
    $user = User::factory()->create()->fresh();

    expect(fn () => $user->attribute_that_does_not_exist)
        ->toThrow(MissingAttributeException::class);
});

// Laravel only arms lazy-loading prevention on models hydrated as part of a
// multi-row result: a lone fetch cannot be an N+1, so the tests query a pair.
function twoClients(): Collection
{
    Client::factory()->count(2)->for(User::factory()->create())->create();

    return Client::query()->get();
}

test('a lazy load throws outside production', function (): void {
    $client = twoClients()->firstOrFail();

    expect(fn () => $client->missions)->toThrow(LazyLoadingViolationException::class);
});

test('a lazy load in production is served instead of thrown', function (): void {
    $this->app['env'] = 'production';

    $client = twoClients()->firstOrFail();

    expect($client->missions)->toBeInstanceOf(Collection::class);
});

test('a lazy load in production reaches sentry once per relation', function (): void {
    $this->app['env'] = 'production';

    $transport = new class implements TransportInterface
    {
        /** @var list<Event> */
        public array $events = [];

        public function send(Event $event): Result
        {
            $this->events[] = $event;

            return new Result(ResultStatus::success(), $event);
        }

        public function close(?int $timeout = null): Result
        {
            return new Result(ResultStatus::success());
        }
    };

    $sentryClient = ClientBuilder::create(['dsn' => 'https://public@sentry.example/1'])
        ->setTransport($transport)
        ->getClient();
    $previousHub = SentrySdk::getCurrentHub();
    SentrySdk::setCurrentHub(new Hub($sentryClient));

    try {
        foreach (twoClients() as $client) {
            $client->missions;
        }
    } finally {
        SentrySdk::setCurrentHub($previousHub);
    }

    expect($transport->events)->toHaveCount(1);

    $event = $transport->events[0];

    expect((string) $event->getLevel())->toBe('warning')
        ->and($event->getContexts()['violation'])->toMatchArray(['kind' => 'lazy_loading', 'relation' => 'missions'])
        ->and($event->getExceptions()[0]->getType())->toBe(LazyLoadingViolationException::class);
});
