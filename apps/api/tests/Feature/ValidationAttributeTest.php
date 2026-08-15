<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;

test('validation messages carry the localized field name, not the camelCase key', function (): void {
    $response = $this->actingAs(User::factory()->create())
        ->putJson('/api/settings', settingsPayload(['workdayMinutes' => 0]))
        ->assertUnprocessable();

    expect($response->json('errors.workdayMinutes.0'))
        ->toContain('durée de journée')
        ->not->toContain('workdayMinutes')
        ->not->toContain('workday minutes');
});
