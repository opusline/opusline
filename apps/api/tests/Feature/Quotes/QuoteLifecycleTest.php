<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Enums\QuoteStatus;
use App\Domain\Invoices\Models\Quote;
use App\Domain\Users\Models\User;

beforeEach(function (): void {
    $this->travelTo('2026-08-10 12:00:00');
});

function sentQuote(User $user, array $attributes = []): Quote
{
    return Quote::factory()->for($user)->for(Client::factory()->for($user)->create())->sent()->create([
        'issued_on' => '2026-08-01',
        'valid_until' => '2026-08-31',
        ...$attributes,
    ]);
}

test('records the client\'s acceptance, today unless told otherwise', function (): void {
    $user = User::factory()->create();
    $quote = sentQuote($user);

    $this->actingAs($user)
        ->postJson("/api/invoicing/quotes/{$quote->id}/accept")
        ->assertOk()
        ->assertJsonPath('quote.status', QuoteStatus::Accepted->value)
        ->assertJsonPath('quote.acceptedOn', '2026-08-10')
        ->assertJsonPath('quote.refusedOn', null);
});

test('records a refusal on the day it was given', function (): void {
    $user = User::factory()->create();
    $quote = sentQuote($user);

    $this->actingAs($user)
        ->postJson("/api/invoicing/quotes/{$quote->id}/refuse", ['decidedOn' => '2026-08-05'])
        ->assertOk()
        ->assertJsonPath('quote.status', QuoteStatus::Refused->value)
        ->assertJsonPath('quote.refusedOn', '2026-08-05');
});

test('refuses an answer dated before the quote went out', function (): void {
    $user = User::factory()->create();
    $quote = sentQuote($user);

    $this->actingAs($user)
        ->postJson("/api/invoicing/quotes/{$quote->id}/accept", ['decidedOn' => '2026-07-31'])
        ->assertUnprocessable()
        ->assertJsonValidationErrorFor('decidedOn');
});

test('takes no answer on a draft, a decided or an expired quote', function (callable $arrange, string $message): void {
    $user = User::factory()->create();
    $quote = $arrange($user);

    $this->actingAs($user)
        ->postJson("/api/invoicing/quotes/{$quote->id}/accept")
        ->assertConflict()
        ->assertJsonPath('message', __($message));
})->with([
    'a draft' => [fn (User $user) => Quote::factory()->for($user)->for(Client::factory()->for($user)->create())->create(), 'quotes.cannot_decide'],
    'an accepted quote' => [fn (User $user): Quote => sentQuote($user, ['status' => QuoteStatus::Accepted, 'accepted_on' => '2026-08-05']), 'quotes.cannot_decide'],
    'an expired quote' => [fn (User $user): Quote => sentQuote($user, ['valid_until' => '2026-08-09']), 'quotes.cannot_decide'],
]);

test('reopens a refused quote with a fresh validity', function (): void {
    $user = User::factory()->create();
    $quote = sentQuote($user, ['status' => QuoteStatus::Refused, 'refused_on' => '2026-08-05', 'validity_days' => 15]);

    $this->actingAs($user)
        ->postJson("/api/invoicing/quotes/{$quote->id}/reopen")
        ->assertOk()
        ->assertJsonPath('quote.status', QuoteStatus::Sent->value)
        ->assertJsonPath('quote.refusedOn', null)
        ->assertJsonPath('quote.number', $quote->number)
        ->assertJsonPath('quote.validUntil', '2026-08-25')
        ->assertJsonPath('quote.isExpired', false);
});

test('reopens an expired quote', function (): void {
    $user = User::factory()->create();
    $quote = sentQuote($user, ['valid_until' => '2026-08-09']);

    $this->actingAs($user)->getJson("/api/invoicing/quotes/{$quote->id}")->assertJsonPath('quote.isExpired', true);
    $this->actingAs($user)
        ->postJson("/api/invoicing/quotes/{$quote->id}/reopen")
        ->assertOk()
        ->assertJsonPath('quote.validUntil', '2026-09-09')
        ->assertJsonPath('quote.isExpired', false);
});

test('leaves an accepted quote, an open one and a draft as they are', function (callable $arrange): void {
    $user = User::factory()->create();
    $quote = $arrange($user);

    $this->actingAs($user)
        ->postJson("/api/invoicing/quotes/{$quote->id}/reopen")
        ->assertConflict()
        ->assertJsonPath('message', __('quotes.cannot_reopen'));
})->with([
    'accepted' => [fn (User $user): Quote => sentQuote($user, ['status' => QuoteStatus::Accepted, 'accepted_on' => '2026-08-05'])],
    'still open' => [fn (User $user): Quote => sentQuote($user)],
    'a draft' => [fn (User $user) => Quote::factory()->for($user)->for(Client::factory()->for($user)->create())->create()],
]);

test('lists the account\'s quotes newest first, by status, by expiry and by client', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $open = Quote::factory()->for($user)->for($client)->sent()->create(['issued_on' => '2026-08-01', 'valid_until' => '2026-08-31']);
    $expired = Quote::factory()->for($user)->for($client)->sent()->create(['issued_on' => '2026-07-01', 'valid_until' => '2026-07-31']);
    $accepted = Quote::factory()->for($user)->for(Client::factory()->for($user)->create())->accepted()->create(['issued_on' => '2026-08-05']);
    Quote::factory()->for(User::factory()->create())->sent()->create();

    $this->actingAs($user)->getJson('/api/invoicing/quotes')
        ->assertOk()
        ->assertJsonCount(3, 'quotes')
        ->assertJsonPath('quotes.0.quote.id', $accepted->id)
        ->assertJsonPath('quotes.1.quote.id', $open->id)
        ->assertJsonPath('quotes.2.quote.id', $expired->id)
        ->assertJsonPath('quotes.2.quote.isExpired', true);
    $this->actingAs($user)->getJson('/api/invoicing/quotes?status='.QuoteStatus::Accepted->value)
        ->assertJsonCount(1, 'quotes')
        ->assertJsonPath('quotes.0.quote.id', $accepted->id);
    $this->actingAs($user)->getJson('/api/invoicing/quotes?expired=1')
        ->assertJsonCount(1, 'quotes')
        ->assertJsonPath('quotes.0.quote.id', $expired->id);
    $this->actingAs($user)->getJson('/api/invoicing/quotes?expired=0')
        ->assertJsonCount(1, 'quotes')
        ->assertJsonPath('quotes.0.quote.id', $open->id);
    $this->actingAs($user)->getJson("/api/invoicing/quotes?clientId={$client->id}")
        ->assertJsonCount(2, 'quotes');
});

test('refuses a filter on another account\'s client', function (): void {
    $user = User::factory()->create();
    $foreign = Client::factory()->for(User::factory()->create())->create();

    $this->actingAs($user)->getJson("/api/invoicing/quotes?clientId={$foreign->id}")->assertUnprocessable();
});

test('tells which statuses a quote can take next', function (callable $arrange, array $next): void {
    $user = User::factory()->create();
    $quote = $arrange($user);

    $this->actingAs($user)
        ->getJson("/api/invoicing/quotes/{$quote->id}")
        ->assertOk()
        ->assertJsonPath('nextStatuses', $next);
})->with([
    'a draft goes out' => [fn (User $user) => Quote::factory()->for($user)->for(Client::factory()->for($user)->create())->create(), [QuoteStatus::Sent->value]],
    'an open quote awaits its answer' => [fn (User $user): Quote => sentQuote($user), [QuoteStatus::Accepted->value, QuoteStatus::Refused->value]],
    'an expired quote only reopens' => [fn (User $user): Quote => sentQuote($user, ['valid_until' => '2026-08-09']), [QuoteStatus::Sent->value]],
    'an accepted quote is a contract' => [fn (User $user): Quote => sentQuote($user, ['status' => QuoteStatus::Accepted, 'accepted_on' => '2026-08-05']), []],
    'a refused quote reopens' => [fn (User $user): Quote => sentQuote($user, ['status' => QuoteStatus::Refused, 'refused_on' => '2026-08-05']), [QuoteStatus::Sent->value]],
]);
