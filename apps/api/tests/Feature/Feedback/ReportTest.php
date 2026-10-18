<?php

declare(strict_types=1);

use App\Domain\Feedback\Enums\ReportKind;
use App\Domain\Feedback\Relay\ProofOfWork;
use App\Domain\Feedback\Reporting\InstanceId;
use App\Domain\Users\Models\User;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

const REPORT_RELAY = 'https://relay.opusline.test';

beforeEach(function (): void {
    config()->set('reports.relay_url', REPORT_RELAY);
    config()->set('app.version', '0.34.0');
    $this->actingAs(User::factory()->create());
});

/** The relay answering a challenge, then filing the report as issue 640. */
function fakeRelay(int $difficulty = 4, mixed $filed = null): void
{
    Http::fake([
        REPORT_RELAY.'/api/relay/challenge' => Http::response(['challenge' => 'puzzle', 'difficulty' => $difficulty, 'expiresAt' => '2026-10-18T12:00:00+00:00']),
        REPORT_RELAY.'/api/relay/reports' => $filed ?? Http::response(['number' => 640, 'url' => 'https://github.com/opusline/opusline/issues/640'], 201),
    ]);
}

function reportPayload(array $overrides = []): array
{
    return [
        'kind' => ReportKind::Bug->value,
        'title' => '  The invoice preview is cut on the right  ',
        'body' => 'Opening the editor at 1280 px hides the totals column.',
        'context' => null,
        ...$overrides,
    ];
}

/** The report the relay received, decoded. */
function relayedReport(): array
{
    $sent = Http::recorded(fn (Request $request): bool => $request->url() === REPORT_RELAY.'/api/relay/reports');
    expect($sent)->toHaveCount(1);

    return $sent->first()[0]->data();
}

test('files the report through the relay and answers the issue', function (): void {
    fakeRelay();

    $this->postJson('/api/reports', reportPayload())
        ->assertCreated()
        ->assertExactJson(['number' => 640, 'url' => 'https://github.com/opusline/opusline/issues/640']);

    expect(relayedReport())->toMatchArray([
        'kind' => ReportKind::Bug->value,
        'title' => 'The invoice preview is cut on the right',
        'body' => 'Opening the editor at 1280 px hides the totals column.',
        'instanceId' => InstanceId::current(),
        'version' => '0.34.0',
        'challenge' => 'puzzle',
    ]);
});

test('pays for the report with a proof of work that holds', function (): void {
    fakeRelay(difficulty: 6);

    $this->postJson('/api/reports', reportPayload())->assertCreated();

    expect(ProofOfWork::satisfies('puzzle', relayedReport()['nonce'], 6))->toBeTrue();
});

test('appends the technical context the account agreed to share', function (): void {
    fakeRelay();

    $this->postJson('/api/reports', reportPayload(['context' => [
        'route' => '/invoicing/invoices/12',
        'browser' => 'Firefox 144 on Linux',
        'locale' => 'fr',
    ]]))->assertCreated();

    expect(relayedReport()['body'])
        ->toContain("- Route: `/invoicing/invoices/12`\n- Browser: `Firefox 144 on Linux`\n- Locale: `fr`");
});

test('keeps a context value literal', function (): void {
    fakeRelay();

    $this->postJson('/api/reports', reportPayload(['context' => [
        'route' => '/missions/`**bold**`',
        'browser' => 'Firefox',
        'locale' => 'en',
    ]]))->assertCreated();

    expect(relayedReport()['body'])->toContain('- Route: `/missions/**bold**`');
});

test('answers 404 while the instance has switched reports off', function (): void {
    config()->set('reports.enabled', false);
    fakeRelay();

    $this->postJson('/api/reports', reportPayload())->assertNotFound();
    Http::assertNothingSent();
});

test('answers 404 while no relay is configured', function (): void {
    config()->set('reports.relay_url');

    $this->postJson('/api/reports', reportPayload())->assertNotFound();
});

test('tells the app it can send reports when a relay is configured', function (): void {
    $this->getJson('/api/user')->assertJsonPath('canSendReports', true);
});

test('tells the app it cannot send reports without a relay', function (string $setting, mixed $value): void {
    config()->set($setting, $value);

    $this->getJson('/api/user')->assertJsonPath('canSendReports', false);
})->with([
    'switched off' => ['reports.enabled', false],
    'no relay' => ['reports.relay_url', null],
]);

test('refuses a puzzle harder than the instance spends', function (): void {
    fakeRelay(difficulty: 25);

    $this->postJson('/api/reports', reportPayload())
        ->assertStatus(502)
        ->assertJsonPath('message', __('feedback.report_not_delivered'));
    Http::assertSentCount(1);
});

test('answers 429 when the relay rate-limits the instance', function (): void {
    fakeRelay(filed: Http::response(['message' => 'Too Many Attempts.'], 429));

    $this->postJson('/api/reports', reportPayload())
        ->assertTooManyRequests()
        ->assertJsonPath('message', __('feedback.report_relay_busy'));
});

test('answers 502 when the relay cannot deliver the report', function (mixed $filed): void {
    fakeRelay(filed: $filed);

    $this->postJson('/api/reports', reportPayload())
        ->assertStatus(502)
        ->assertJsonPath('message', __('feedback.report_not_delivered'));
})->with([
    'unreachable' => fn () => Http::failedConnection(),
    'GitHub refused it' => fn () => Http::response(['message' => 'GitHub refused the report for now.'], 502),
    'an unexpected answer' => fn () => Http::response(['issue' => 640], 201),
]);

test('limits an account to three reports an hour', function (): void {
    fakeRelay();

    foreach (range(1, 3) as $attempt) {
        $this->postJson('/api/reports', reportPayload())->assertCreated();
    }

    $this->postJson('/api/reports', reportPayload())->assertTooManyRequests();
});

test('validates the report', function (array $overrides, string $field): void {
    fakeRelay();

    $this->postJson('/api/reports', reportPayload($overrides))
        ->assertUnprocessable()
        ->assertJsonValidationErrors($field);
    Http::assertNothingSent();
})->with([
    'unknown kind' => [['kind' => 7], 'kind'],
    'short title' => [['title' => 'Bug'], 'title'],
    'long title' => [['title' => str_repeat('a', 121)], 'title'],
    'short body' => [['body' => 'Broken.'], 'body'],
    'long body' => [['body' => str_repeat('a', 6001)], 'body'],
    'context without a route' => [['context' => ['browser' => 'Firefox', 'locale' => 'en']], 'context.route'],
    'long browser' => [['context' => ['route' => '/', 'browser' => str_repeat('a', 256), 'locale' => 'en']], 'context.browser'],
]);

test('keeps the reporter to signed-in accounts', function (): void {
    auth()->logout();
    fakeRelay();

    $this->postJson('/api/reports', reportPayload())->assertUnauthorized();
});

test('derives a stable instance id from the app key', function (): void {
    $first = InstanceId::current();

    expect(InstanceId::current())->toBe($first)
        ->and(Str::isUuid($first))->toBeTrue();

    config()->set('app.key', 'base64:'.base64_encode(random_bytes(32)));

    expect(InstanceId::current())->not->toBe($first);
});
