<?php

declare(strict_types=1);

use App\Domain\Missions\Models\Mission;
use App\Domain\Missions\Models\MissionBillingStep;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

beforeEach(function (): void {
    $this->travelTo(CarbonImmutable::parse('2026-08-18'));
});

function stepsUrl(Mission $mission): string
{
    return "/api/clients/{$mission->client->slug}/missions/{$mission->slug}/billing-steps";
}

function stepPayload(array $overrides = []): array
{
    return array_merge([
        'label' => 'Acompte',
        'amount' => ['amount' => 240_000, 'currency' => 'EUR'],
    ], $overrides);
}

test('requires authentication to read a schedule', function (): void {
    $mission = forfaitMissionOwnedBy(User::factory()->create());

    $this->getJson(stepsUrl($mission))->assertUnauthorized();
});

test('adds instalments in the order they were written', function (): void {
    $user = User::factory()->create();
    $mission = forfaitMissionOwnedBy($user);

    $this->actingAs($user)->postJson(stepsUrl($mission), stepPayload())->assertCreated();
    $this->actingAs($user)->postJson(stepsUrl($mission), stepPayload([
        'label' => 'Recette',
        'amount' => ['amount' => 320_000, 'currency' => 'EUR'],
        'dueOn' => '2026-09-30',
    ]))->assertCreated();

    $this->actingAs($user)
        ->getJson(stepsUrl($mission))
        ->assertOk()
        ->assertJsonPath('steps.0.label', 'Acompte')
        ->assertJsonPath('steps.0.position', 0)
        ->assertJsonPath('steps.1.label', 'Recette')
        ->assertJsonPath('steps.1.position', 1)
        ->assertJsonPath('steps.1.dueOn', '2026-09-30')
        ->assertJsonPath('scheduled.amount', 560_000);
});

test('refuses a schedule on a mission that has no agreed price to split', function (callable $configure): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, $configure);

    $this->actingAs($user)
        ->postJson(stepsUrl($mission), stepPayload())
        ->assertJsonValidationErrors('billingMode');
})->with([
    'billed by the day' => [fn ($factory) => $factory],
    'billed by the hour' => [fn ($factory) => $factory->hourly()],
]);

test('reports a schedule that does not add up to the price without refusing it', function (): void {
    $user = User::factory()->create();
    $mission = forfaitMissionOwnedBy($user, rateCents: 800_000);

    $this->actingAs($user)->postJson(stepsUrl($mission), stepPayload([
        'amount' => ['amount' => 100_000, 'currency' => 'EUR'],
    ]))->assertCreated();

    // A schedule that disagrees with the price is a discrepancy to look at — an
    // avenant is normal — so the API reports the total and leaves the judgement
    // to whoever is reading it.
    $this->actingAs($user)
        ->getJson(stepsUrl($mission))
        ->assertOk()
        ->assertJsonPath('scheduled.amount', 100_000);
});

test('marks a step ready when the work behind it is done', function (): void {
    $user = User::factory()->create();
    $mission = forfaitMissionOwnedBy($user);
    $step = billingStepFor($user, $mission);

    $this->actingAs($user)
        ->postJson(stepsUrl($mission)."/{$step->id}/ready", ['isReady' => true])
        ->assertOk()
        ->assertJsonPath('steps.0.isReady', true);

    $this->actingAs($user)
        ->postJson(stepsUrl($mission)."/{$step->id}/ready", ['isReady' => false])
        ->assertOk()
        ->assertJsonPath('steps.0.isReady', false);
});

test('refuses to delete a step an invoice already bills', function (): void {
    $user = User::factory()->create();
    $mission = forfaitMissionOwnedBy($user);
    $step = billingStepFor($user, $mission);
    $invoice = invoiceForMission($user, $mission, fn ($factory) => $factory->sent());
    $step->update(['invoice_id' => $invoice->id]);

    $this->actingAs($user)
        ->deleteJson(stepsUrl($mission)."/{$step->id}")
        ->assertJsonValidationErrors('billingStepId');
});

test('deletes a step that has not been billed', function (): void {
    $user = User::factory()->create();
    $mission = forfaitMissionOwnedBy($user);
    $step = billingStepFor($user, $mission);

    $this->actingAs($user)
        ->deleteJson(stepsUrl($mission)."/{$step->id}")
        ->assertNoContent();

    expect(MissionBillingStep::query()->count())->toBe(0);
});

test('404s on a mission of another account', function (): void {
    $user = User::factory()->create();
    $stranger = forfaitMissionOwnedBy(User::factory()->create());

    $this->actingAs($user)->getJson(stepsUrl($stranger))->assertNotFound();
});
