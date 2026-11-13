<?php

declare(strict_types=1);

use App\Domain\AccessTokens\Enums\TokenAbility;
use App\Domain\AccessTokens\Models\AccessToken;
use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;
use App\Http\Users\Support\EnsureSessionIsUnlocked;

/** @param list<string> $abilities */
function tokenFor(User $user, array $abilities = ['invoices:read']): string
{
    return $user->createToken('Runway', $abilities)->plainTextToken;
}

test('reads the invoices with a token', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user);
    $plainText = tokenFor($user);

    $this->withToken($plainText)->getJson('/api/invoices')
        ->assertOk()
        ->assertJsonCount(1, 'invoices')
        ->assertJsonPath('invoices.0.invoice.id', $invoice->id);
    $this->withToken($plainText)->getJson('/api/invoices/'.$invoice->id)
        ->assertOk()
        ->assertJsonPath('invoice.id', $invoice->id);
});

test('reads the uninvoiced periods with a token', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->state(['rate_cents' => 55_000]));
    TimeEntry::factory()->for($mission, 'mission')->create(['user_id' => $user->id]);

    $this->withToken(tokenFor($user))->getJson('/api/uninvoiced-periods')
        ->assertOk()
        ->assertJsonCount(1, 'periods')
        ->assertJsonPath('periods.0.id', $mission->id);
});

test('keeps a token to its own account\'s invoices', function (): void {
    $user = User::factory()->create();
    $foreign = invoiceOwnedBy(User::factory()->create());
    $plainText = tokenFor($user);

    $this->withToken($plainText)->getJson('/api/invoices')
        ->assertOk()
        ->assertJsonCount(0, 'invoices');
    $this->withToken($plainText)->getJson('/api/invoices/'.$foreign->id)->assertNotFound();
});

test('refuses a write with a token', function (string $method, string $uri): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user);
    $plainText = tokenFor($user);

    $this->withToken($plainText)
        ->json($method, str_replace('{invoice}', (string) $invoice->id, $uri))
        ->assertForbidden()
        ->assertJsonPath('message', __('tokens.not_for_tokens'));

    expect(($invoice->fresh() ?? throw new RuntimeException('deleted'))->status)->toBe(InvoiceStatus::Draft)
        ->and($user->invoices()->count())->toBe(1);
})->with([
    ['POST', '/api/invoices'],
    ['PUT', '/api/invoices/{invoice}'],
    ['DELETE', '/api/invoices/{invoice}'],
    ['POST', '/api/invoices/{invoice}/send'],
    ['POST', '/api/invoices/{invoice}/pay'],
    ['PATCH', '/api/invoices/{invoice}/dates'],
    ['DELETE', '/api/invoices/{invoice}/document'],
]);

test('refuses every other domain with a token', function (string $uri): void {
    $user = User::factory()->create();
    $plainText = tokenFor($user);

    $this->withToken($plainText)->getJson($uri)
        ->assertForbidden()
        ->assertJsonPath('message', __('tokens.not_for_tokens'));
})->with([
    '/api/user',
    '/api/clients',
    '/api/settings',
    '/api/invoices/summary',
    '/api/invoices/next-number',
    '/api/revenue',
    '/api/user/two-factor',
]);

test('refuses a token that is not there', function (): void {
    $user = User::factory()->create();
    $plainText = tokenFor($user);

    $this->withToken('1|'.str_repeat('x', 48))->getJson('/api/invoices')->assertUnauthorized();
    $this->withToken('1|'.str_repeat('x', 48))->getJson('/api/uninvoiced-periods')->assertUnauthorized();

    AccessToken::query()->delete();

    $this->withToken($plainText)->getJson('/api/invoices')->assertUnauthorized();
});

test('a token holds only the abilities it was minted with', function (string $uri): void {
    $user = User::factory()->create();
    $plainText = tokenFor($user, ['something:else']);

    $this->withToken($plainText)->getJson($uri)->assertForbidden();
})->with([
    '/api/invoices',
    '/api/uninvoiced-periods',
]);

test('is not held by a locked session riding along', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user);
    $plainText = tokenFor($user);

    fromSpa()
        ->withSession([EnsureSessionIsUnlocked::SESSION_KEY => true])
        ->withToken($plainText)
        ->getJson('/api/invoices')
        ->assertOk()
        ->assertJsonCount(1, 'invoices');
});

test('is rate limited like the rest of the API', function (): void {
    $user = User::factory()->create();
    $plainText = tokenFor($user);

    $this->withToken($plainText)->getJson('/api/invoices')
        ->assertOk()
        ->assertHeader('X-RateLimit-Limit', '120');
});

test('records when the token was last used', function (): void {
    $user = User::factory()->create();
    $created = $user->createToken('Runway', ['invoices:read']);

    $this->withToken($created->plainTextToken)->getJson('/api/invoices')->assertOk();

    expect($created->accessToken->fresh()?->last_used_at)->not->toBeNull();
    fromSpa()->actingAs($user)->getJson('/api/user/tokens')
        ->assertOk()
        ->assertJsonPath('tokens.0.lastUsedAt', fn (mixed $value): bool => is_string($value));
});

test('reads the missions across clients with a missions:read token', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    missionOwnedBy(User::factory()->create());

    $this->withToken(tokenFor($user, [TokenAbility::ReadMissions->value]))->getJson('/api/missions')
        ->assertOk()
        ->assertJsonCount(1, 'missions')
        ->assertJsonPath('missions.0.mission.id', $mission->id)
        ->assertJsonPath('missions.0.clientName', $mission->client->name);
});

test('reads the treasury with a treasury:read token', function (): void {
    freezeTodayAtUtcNoon();
    $user = User::factory()->create();
    typedBankBalanceFor($user, 1_000_000, '2026-08-10');

    $this->withToken(tokenFor($user, [TokenAbility::ReadTreasury->value]))->getJson('/api/treasury')
        ->assertOk()
        ->assertJsonPath('balance.amount.amount', 1_000_000);
});

test('reads the declarations with a declarations:read token', function (): void {
    freezeTodayAtUtcNoon();
    $user = User::factory()->create();

    $this->withToken(tokenFor($user, [TokenAbility::ReadDeclarations->value]))->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('period', '2026-07');
});

test('opens a read only to the ability that names it', function (string $uri, TokenAbility $opener, TokenAbility $held): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user);

    $response = $this->withToken(tokenFor($user, [$held->value]))
        ->getJson(str_replace('{invoice}', (string) $invoice->id, $uri));

    $held === $opener ? $response->assertOk() : $response->assertForbidden();
})->with([
    ['/api/invoices', TokenAbility::ReadInvoices],
    ['/api/invoices/{invoice}', TokenAbility::ReadInvoices],
    ['/api/uninvoiced-periods', TokenAbility::ReadInvoices],
    ['/api/missions', TokenAbility::ReadMissions],
    ['/api/treasury', TokenAbility::ReadTreasury],
    ['/api/declarations', TokenAbility::ReadDeclarations],
])->with(TokenAbility::cases());

test('keeps a missions:read token off the rest of the client', function (string $uri): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    $this->withToken(tokenFor($user, [TokenAbility::ReadMissions->value]))
        ->getJson(strtr($uri, ['{client}' => $mission->client->slug, '{mission}' => $mission->slug]))
        ->assertForbidden()
        ->assertJsonPath('message', __('tokens.not_for_tokens'));
})->with([
    '/api/clients',
    '/api/clients/{client}',
    '/api/clients/{client}/revenue',
    '/api/clients/{client}/logo',
    '/api/clients/{client}/documents',
    '/api/clients/{client}/missions/{mission}',
    '/api/clients/{client}/missions/{mission}/revenue',
    '/api/clients/{client}/missions/{mission}/documents',
    '/api/clients/{client}/missions/{mission}/time-entries',
]);

test('refuses a write to a token holding every ability', function (string $method, string $uri): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    $invoice = invoiceOwnedBy($user, $mission->client);
    $transfer = personalTransferFor($user);

    $this->withToken(tokenFor($user, array_column(TokenAbility::cases(), 'value')))
        ->json($method, strtr($uri, [
            '{client}' => $mission->client->slug,
            '{mission}' => $mission->slug,
            '{invoice}' => (string) $invoice->id,
            '{transfer}' => (string) $transfer->id,
            '{completion}' => FiscalDeadlineKind::UrssafDeclaration->value.'/2026-07',
        ]))
        ->assertForbidden()
        ->assertJsonPath('message', __('tokens.not_for_tokens'));
})->with([
    ['POST', '/api/clients'],
    ['PUT', '/api/clients/{client}'],
    ['DELETE', '/api/clients/{client}'],
    ['POST', '/api/clients/{client}/missions'],
    ['PUT', '/api/clients/{client}/missions/{mission}'],
    ['DELETE', '/api/clients/{client}/missions/{mission}'],
    ['POST', '/api/treasury/transfers'],
    ['DELETE', '/api/treasury/transfers/{transfer}'],
    ['POST', '/api/declarations/completions'],
    ['DELETE', '/api/declarations/completions/{completion}'],
    ['POST', '/api/declarations/completions/{completion}/payment'],
    ['DELETE', '/api/declarations/completions/{completion}/payment'],
    ['POST', '/api/invoices'],
    ['PUT', '/api/invoices/{invoice}'],
    ['DELETE', '/api/invoices/{invoice}'],
    ['POST', '/api/invoices/{invoice}/pay'],
]);
