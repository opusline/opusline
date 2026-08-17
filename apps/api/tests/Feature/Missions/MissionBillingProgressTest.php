<?php

declare(strict_types=1);

use App\Domain\Missions\Models\Mission;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

function missionBillingUrl(Mission $mission): string
{
    return "/api/clients/{$mission->client->slug}/missions/{$mission->slug}/billing";
}

/** A forfait mission sold at the given price. */
function forfaitMission(User $user, int $priceCents): Mission
{
    return missionOwnedBy($user, fn ($factory) => $factory->state([
        'billing_mode' => 2,
        'currency' => 'EUR',
        'rate_cents' => $priceCents,
    ]));
}

test('requires authentication', function (): void {
    $mission = forfaitMission(User::factory()->create(), 1_000_000);

    $this->getJson(missionBillingUrl($mission))->assertUnauthorized();
});

test('reports nothing billed on a fresh forfait', function (): void {
    $user = User::factory()->create();
    $mission = forfaitMission($user, 1_000_000);

    $this->actingAs($user)
        ->getJson(missionBillingUrl($mission))
        ->assertOk()
        ->assertJsonPath('fixedPrice.amount', 1_000_000)
        ->assertJsonPath('invoiced.amount', 0)
        ->assertJsonPath('remaining.amount', 1_000_000)
        ->assertJsonPath('progressBp', 0)
        ->assertJsonPath('isOverBilled', false);
});

test('answers null for a mission billed by the day', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->state([
        'billing_mode' => 0,
        'currency' => 'EUR',
        'rate_cents' => 55_000,
    ]));

    // A day rate has no agreed total, so there is no progress to report — and a
    // zero would read as "nothing billed" rather than "not applicable".
    $this->actingAs($user)
        ->getJson(missionBillingUrl($mission))
        ->assertOk()
        ->assertExactJson([]);
});

test('adds up instalments billed against the agreed price', function (): void {
    $user = User::factory()->create();
    $mission = forfaitMission($user, 1_000_000);

    // The 30 / 40 pattern the issue describes.
    invoiceForMission($user, $mission, fn ($factory) => $factory->sent()->state([
        'amount_ht_cents' => 300_000,
    ]));
    invoiceForMission($user, $mission, fn ($factory) => $factory->paid()->state([
        'amount_ht_cents' => 400_000,
    ]));

    $this->actingAs($user)
        ->getJson(missionBillingUrl($mission))
        ->assertOk()
        ->assertJsonPath('invoiced.amount', 700_000)
        ->assertJsonPath('remaining.amount', 300_000)
        ->assertJsonPath('progressBp', 7000)
        ->assertJsonPath('issuedCount', 2)
        ->assertJsonPath('isOverBilled', false);
});

test('leaves a draft instalment out of the billed total but still counts it', function (): void {
    $user = User::factory()->create();
    $mission = forfaitMission($user, 1_000_000);

    invoiceForMission($user, $mission, fn ($factory) => $factory->sent()->state([
        'amount_ht_cents' => 300_000,
    ]));
    invoiceForMission($user, $mission, fn ($factory) => $factory->state([
        'amount_ht_cents' => 400_000,
    ]));

    $this->actingAs($user)
        ->getJson(missionBillingUrl($mission))
        ->assertOk()
        ->assertJsonPath('invoiced.amount', 300_000)
        ->assertJsonPath('issuedCount', 1)
        ->assertJsonPath('draftCount', 1);
});

test('flags a forfait billed past its agreed price', function (): void {
    $user = User::factory()->create();
    $mission = forfaitMission($user, 1_000_000);

    invoiceForMission($user, $mission, fn ($factory) => $factory->sent()->state([
        'amount_ht_cents' => 1_200_000,
    ]));

    // Scope grew and the extra was invoiced. A real state, so it is reported
    // rather than refused — the remaining figure simply goes negative.
    $this->actingAs($user)
        ->getJson(missionBillingUrl($mission))
        ->assertOk()
        ->assertJsonPath('remaining.amount', -200_000)
        ->assertJsonPath('progressBp', 12_000)
        ->assertJsonPath('isOverBilled', true);
});

test('reports a fully billed forfait as complete without flagging it', function (): void {
    $user = User::factory()->create();
    $mission = forfaitMission($user, 1_000_000);

    invoiceForMission($user, $mission, fn ($factory) => $factory->paid()->state([
        'amount_ht_cents' => 1_000_000,
    ]));

    $this->actingAs($user)
        ->getJson(missionBillingUrl($mission))
        ->assertOk()
        ->assertJsonPath('remaining.amount', 0)
        ->assertJsonPath('progressBp', 10_000)
        ->assertJsonPath('isOverBilled', false);
});

test('never counts an invoice of another mission', function (): void {
    $user = User::factory()->create();
    $mission = forfaitMission($user, 1_000_000);
    $otherMission = forfaitMission($user, 1_000_000);

    invoiceForMission($user, $otherMission, fn ($factory) => $factory->sent()->state([
        'amount_ht_cents' => 500_000,
    ]));

    $this->actingAs($user)
        ->getJson(missionBillingUrl($mission))
        ->assertOk()
        ->assertJsonPath('invoiced.amount', 0);
});

test('hides a mission of another account behind a 404', function (): void {
    $stranger = forfaitMission(User::factory()->create(), 1_000_000);

    $this->actingAs(User::factory()->create())
        ->getJson(missionBillingUrl($stranger))
        ->assertNotFound();
});
