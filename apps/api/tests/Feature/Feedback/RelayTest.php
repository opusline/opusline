<?php

declare(strict_types=1);

use App\Domain\Feedback\Enums\ReportKind;
use App\Domain\Feedback\Relay\ProofOfWork;
use Illuminate\Http\Client\Factory;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;

const RELAY_INSTANCE = '0b6f6a2e-5a3c-4d1e-9f0a-2c3b4d5e6f70';

beforeEach(function (): void {
    $key = openssl_pkey_new(['private_key_bits' => 2048, 'private_key_type' => OPENSSL_KEYTYPE_RSA]);
    openssl_pkey_export($key, $pem);
    config()->set('relay.github', [
        'app_id' => '123456',
        'private_key' => str_replace("\n", '\n', $pem),
        'installation_id' => '987654',
        'repository' => 'opusline/opusline',
    ]);
    // Keeps solving cheap in tests; the production default is 18.
    config()->set('relay.difficulty', 8);
    Http::fake([
        'api.github.com/app/installations/987654/access_tokens' => Http::response(['token' => 'ghs_installation'], 201),
        'api.github.com/repos/opusline/opusline/issues' => Http::response(['number' => 631, 'html_url' => 'https://github.com/opusline/opusline/issues/631'], 201),
    ]);
});

/** A report as an instance sends it, its challenge fetched and solved. */
function solvedReport(array $overrides = []): array
{
    $challenge = test()->getJson('/api/relay/challenge')->assertOk()->json('challenge');

    return [
        'kind' => ReportKind::Bug->value,
        'title' => 'The invoice preview is cut on the right',
        'body' => 'Opening the editor at 1280 px hides the totals column.',
        'instanceId' => RELAY_INSTANCE,
        'version' => '0.34.0',
        'challenge' => $challenge,
        'nonce' => ProofOfWork::solve($challenge, 8),
        ...$overrides,
    ];
}

test('hands out a challenge with its difficulty and expiry', function (): void {
    $this->getJson('/api/relay/challenge')
        ->assertOk()
        ->assertJsonPath('difficulty', 8)
        ->assertJsonStructure(['challenge', 'difficulty', 'expiresAt']);
});

test('files a solved report as an issue of its type, saying where it came from', function (): void {
    $this->postJson('/api/relay/reports', solvedReport())
        ->assertCreated()
        ->assertJsonPath('number', 631)
        ->assertJsonPath('url', 'https://github.com/opusline/opusline/issues/631');

    Http::assertSent(fn (Request $request): bool => str_ends_with($request->url(), '/repos/opusline/opusline/issues')
        && $request['type'] === 'Bug'
        && $request['title'] === 'The invoice preview is cut on the right'
        && str_contains($request['body'], 'Reported from Opusline 0.34.0 via the in-app reporter · instance `'.RELAY_INSTANCE.'`')
        && $request->hasHeader('Authorization', 'Bearer ghs_installation'));
});

test('files a feature request as a Feature issue', function (): void {
    $this->postJson('/api/relay/reports', solvedReport(['kind' => ReportKind::Feature->value]))->assertCreated();

    Http::assertSent(fn (Request $request): bool => str_ends_with($request->url(), '/issues') && $request['type'] === 'Feature');
});

test('refuses a report whose proof of work does not hold', function (): void {
    $this->postJson('/api/relay/reports', solvedReport(['nonce' => 'not-the-answer']))
        ->assertUnprocessable()
        ->assertJsonValidationErrorFor('nonce');

    Http::assertNotSent(fn (Request $request): bool => str_ends_with($request->url(), '/issues'));
});

test('takes each challenge once', function (): void {
    $report = solvedReport();
    $this->postJson('/api/relay/reports', $report)->assertCreated();

    $this->postJson('/api/relay/reports', $report)->assertUnprocessable();
});

test('refuses a challenge it did not sign', function (): void {
    $forged = now()->addMinutes(5)->getTimestamp().'.'.bin2hex(random_bytes(16)).'.'.str_repeat('0', 64);

    $this->postJson('/api/relay/reports', solvedReport(['challenge' => $forged, 'nonce' => ProofOfWork::solve($forged, 8)]))
        ->assertUnprocessable();
});

test('refuses a challenge past its ten minutes', function (): void {
    $report = solvedReport();
    $this->travel(11)->minutes();

    $this->postJson('/api/relay/reports', $report)->assertUnprocessable();
});

test('refuses an instance or an address on the blocklist', function (string $blocked): void {
    config()->set('relay.blocklist', [$blocked]);

    $this->postJson('/api/relay/reports', solvedReport())->assertForbidden();
})->with([
    'instance' => [RELAY_INSTANCE],
    'address' => ['127.0.0.1'],
]);

test('rations one instance to five reports an hour', function (): void {
    foreach (range(1, 5) as $attempt) {
        $this->postJson('/api/relay/reports', solvedReport())->assertCreated();
    }

    $this->postJson('/api/relay/reports', solvedReport())->assertTooManyRequests();
});

test('answers 502 when GitHub refuses the issue', function (): void {
    // A fresh fake: the first stub registered for a URL wins, and beforeEach's answers 201.
    Http::swap(new Factory);
    Http::fake([
        'api.github.com/app/installations/987654/access_tokens' => Http::response(['token' => 'ghs_installation'], 201),
        'api.github.com/repos/*' => Http::response(['message' => 'Validation Failed'], 422),
    ]);

    $this->postJson('/api/relay/reports', solvedReport())->assertStatus(502);
});

test('does not exist on an instance that is not the relay', function (): void {
    config()->set('relay.github.app_id');

    $this->getJson('/api/relay/challenge')->assertNotFound();
    $this->postJson('/api/relay/reports', [])->assertNotFound();
});
