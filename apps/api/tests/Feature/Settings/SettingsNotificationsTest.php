<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;

test('a new account receives every email until it says otherwise', function (): void {
    $this->actingAs(User::factory()->create())
        ->getJson('/api/settings')
        ->assertOk()
        ->assertJsonPath('notifications', ['securityAlerts' => true, 'deadlineReminders' => true]);
});

test('saves which emails the account wants', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->putJson('/api/settings/notifications', ['securityAlerts' => false, 'deadlineReminders' => true])
        ->assertOk()
        ->assertJsonPath('notifications', ['securityAlerts' => false, 'deadlineReminders' => true]);

    $settings = $user->settings()->sole();

    expect($settings->mail_security_alerts)->toBeFalse()
        ->and($settings->mail_deadline_reminders)->toBeTrue();
});

test('refuses a preference that is not a yes or a no', function (string $field): void {
    $payload = ['securityAlerts' => true, 'deadlineReminders' => true];

    $this->actingAs(User::factory()->create())
        ->putJson('/api/settings/notifications', [...$payload, $field => 'sometimes'])
        ->assertJsonValidationErrorFor($field);
})->with(['securityAlerts', 'deadlineReminders']);

test('refuses a partial set of preferences', function (): void {
    $this->actingAs(User::factory()->create())
        ->putJson('/api/settings/notifications', ['securityAlerts' => false])
        ->assertJsonValidationErrorFor('deadlineReminders');
});

test('saving the settings form leaves the email preferences alone', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['mail_security_alerts' => false, 'mail_deadline_reminders' => false]);

    $this->actingAs($user)
        ->putJson('/api/settings', settingsPayload())
        ->assertOk()
        ->assertJsonPath('notifications', ['securityAlerts' => false, 'deadlineReminders' => false]);
});

test('email preferences require a signed-in account', function (): void {
    $this->putJson('/api/settings/notifications', ['securityAlerts' => false, 'deadlineReminders' => false])
        ->assertUnauthorized();
});
