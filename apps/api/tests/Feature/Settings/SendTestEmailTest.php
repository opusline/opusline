<?php

declare(strict_types=1);

use App\Domain\Settings\Enums\Locale;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\Exceptions;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Queue;
use Symfony\Component\Mime\Email;

const TEST_EMAIL_PATH = '/api/settings/notifications/test-email';

/** Points the instance at a relay nobody is listening on, so the send fails for real. */
function unreachableRelay(): void
{
    config()->set('mail.default', 'smtp');
    config()->set('mail.mailers.smtp.host', '127.0.0.1');
    config()->set('mail.mailers.smtp.port', 1);
}

test('a mail test sends the account one email directly and one through the queue', function (): void {
    $user = User::factory()->create(['email' => 'theo@example.com']);

    $this->actingAs($user)->postJson(TEST_EMAIL_PATH)->assertNoContent();

    $mails = sentMails();

    expect($mails->map(fn (Email $mail): string => $mail->getTo()[0]->getAddress())->all())
        ->toBe(['theo@example.com', 'theo@example.com'])
        ->and($mails->map(fn (Email $mail): ?string => $mail->getSubject())->all())
        ->toBe([__('mail.test.direct.subject'), __('mail.test.queued.subject')]);
});

test('the second email is left to the queue', function (): void {
    Queue::fake();
    $user = User::factory()->create();

    $this->actingAs($user)->postJson(TEST_EMAIL_PATH)->assertNoContent();

    expect(sentMails())->toHaveCount(1);
    Queue::assertCount(1);
});

test('the test emails are written in the language of the account', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['locale' => Locale::fr_FR]);
    Queue::fake();

    $this->actingAs($user)->postJson(TEST_EMAIL_PATH)->assertNoContent();

    expect(soleSentMail()->getSubject())->toBe(__('mail.test.direct.subject', locale: 'fr'));
});

test('a relay that does not take the email is reported with its own words, and nothing is queued', function (): void {
    unreachableRelay();
    Queue::fake();

    $response = $this->actingAs(User::factory()->create())->postJson(TEST_EMAIL_PATH)->assertConflict();

    expect($response->json('message'))->toStartWith(__('mail.test.relay_failed', ['reason' => '']))
        ->toContain('127.0.0.1');
    Queue::assertNothingPushed();
});

test('a mailer that cannot even be built is reported the same way', function (): void {
    config()->set('mail.default', 'smpt');

    $response = $this->actingAs(User::factory()->create())->postJson(TEST_EMAIL_PATH)->assertConflict();

    expect($response->json('message'))->toStartWith(__('mail.test.relay_failed', ['reason' => '']))
        ->toContain('smpt');
});

test('a queue that cannot take the second email is named as the broken half, and reported', function (): void {
    $failure = new RuntimeException('Connection refused [tcp://redis:6379]');
    Notification::shouldReceive('sendNow')->once();
    Notification::shouldReceive('send')->once()->andThrow($failure);
    Exceptions::fake();

    $response = $this->actingAs(User::factory()->create())->postJson(TEST_EMAIL_PATH)->assertServiceUnavailable();

    expect($response->json('message'))
        ->toBe(__('mail.test.queue_failed', ['reason' => 'Connection refused [tcp://redis:6379]']));
    Exceptions::assertReported(fn (RuntimeException $reported): bool => $reported === $failure);
});

test('mail tests have their own allowance, not the one other settings actions draw on', function (): void {
    $user = User::factory()->create();

    foreach (range(1, 3) as $attempt) {
        $this->actingAs($user)->postJson('/api/settings/rates/refresh');
    }

    $this->actingAs($user)->postJson(TEST_EMAIL_PATH)->assertNoContent();
});

test('an instance without a mailer has no mail test', function (): void {
    config()->set('mail.enabled', false);

    $this->actingAs(User::factory()->create())->postJson(TEST_EMAIL_PATH)->assertNotFound();
});

test('a mail test requires a signed-in account', function (): void {
    $this->postJson(TEST_EMAIL_PATH)->assertUnauthorized();
});

test('mail tests are rationed, since each one costs the relay two emails', function (): void {
    $user = User::factory()->create();

    foreach (range(1, 3) as $attempt) {
        $this->actingAs($user)->postJson(TEST_EMAIL_PATH)->assertNoContent();
    }

    $this->actingAs($user)->postJson(TEST_EMAIL_PATH)->assertTooManyRequests();
});

test('each test email has its copy, which key parity then carries to French', function (string $leg): void {
    expect(Lang::has("mail.test.{$leg}.subject", 'en', fallback: false))->toBeTrue()
        ->and(Lang::has("mail.test.{$leg}.line", 'en', fallback: false))->toBeTrue();
})->with(['direct', 'queued']);
