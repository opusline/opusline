<?php

declare(strict_types=1);

use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Missions\Models\Mission;
use App\Domain\TimeEntries\Models\TimeEntry;

test('sums a day-rate mission\'s unbilled time into one line at its rate', function (): void {
    $user = issuableAccount();
    $mission = Mission::factory()->for($user)->for(billableClient($user))->create();
    TimeEntry::factory()->for($mission)->create(['date' => '2026-07-01', 'duration_minutes' => 420]);
    TimeEntry::factory()->for($mission)->create(['date' => '2026-07-02', 'duration_minutes' => 210]);
    TimeEntry::factory()->for($mission)->create(['billable' => false]);
    TimeEntry::factory()->for($mission)->create(['invoice_id' => Invoice::factory()->for($user)->for($mission->client)->create()->id]);

    $this->actingAs($user)
        ->getJson("/api/invoicing/unbilled-time?missionId={$mission->id}")
        ->assertOk()
        ->assertJsonPath('quantityMilli', 1500)
        ->assertJsonPath('unit', LineUnit::Day->value)
        ->assertJsonPath('unitPrice.amount', 55_000)
        ->assertJsonPath('firstEntryOn', '2026-07-01')
        ->assertJsonPath('lastEntryOn', '2026-07-02')
        ->assertJsonCount(2, 'timeEntryIds');
});

test('counts an hourly mission in hours', function (): void {
    $user = issuableAccount();
    $mission = Mission::factory()->hourly()->for($user)->for(billableClient($user))->create();
    TimeEntry::factory()->for($mission)->create(['duration_minutes' => 90]);

    $this->actingAs($user)
        ->getJson("/api/invoicing/unbilled-time?missionId={$mission->id}")
        ->assertJsonPath('unit', LineUnit::Hour->value)
        ->assertJsonPath('quantityMilli', 1500)
        ->assertJsonPath('unitPrice.amount', 8_500);
});

test('prices nothing on a fixed price, whose time bills nothing on its own', function (): void {
    $user = issuableAccount();
    $mission = Mission::factory()->fixed()->for($user)->for(billableClient($user))->create();
    TimeEntry::factory()->for($mission)->create();

    $this->actingAs($user)
        ->getJson("/api/invoicing/unbilled-time?missionId={$mission->id}")
        ->assertJsonPath('unitPrice', null);
});

test('marks the imported time as billed by the draft, and gives it back when dropped', function (): void {
    $user = issuableAccount();
    $client = billableClient($user);
    $mission = Mission::factory()->for($user)->for($client)->create();
    $first = TimeEntry::factory()->for($mission)->create();
    $second = TimeEntry::factory()->for($mission)->create();
    $id = draftFor($user, $client, ['missionId' => $mission->id, 'timeEntryIds' => [$first->id, $second->id]]);

    expect($first->fresh()?->invoice_id)->toBe($id)->and($second->fresh()?->invoice_id)->toBe($id);
    $this->actingAs($user)
        ->getJson("/api/invoicing/unbilled-time?missionId={$mission->id}&invoiceId={$id}")
        ->assertJsonCount(2, 'timeEntryIds');
    $this->actingAs($user)->getJson("/api/invoices/{$id}")->assertJsonCount(2, 'content.timeEntryIds');

    $this->actingAs($user)
        ->putJson("/api/invoicing/invoices/{$id}", draftPayloadFor($client, ['missionId' => $mission->id, 'timeEntryIds' => [$first->id]]))
        ->assertOk();

    expect($second->fresh()?->invoice_id)->toBeNull();
});

test('refuses time from another mission', function (): void {
    $user = issuableAccount();
    $client = billableClient($user);
    $mission = Mission::factory()->for($user)->for($client)->create();
    $elsewhere = TimeEntry::factory()->for(Mission::factory()->for($user)->for($client))->create();

    $this->actingAs($user)
        ->postJson('/api/invoicing/invoices', draftPayloadFor($client, ['missionId' => $mission->id, 'timeEntryIds' => [$elsewhere->id]]))
        ->assertJsonValidationErrorFor('timeEntryIds');
});

test('keeps another account\'s mission out of reach', function (): void {
    $user = issuableAccount();
    $foreign = Mission::factory()->create();

    $this->actingAs($user)->getJson("/api/invoicing/unbilled-time?missionId={$foreign->id}")->assertNotFound();
});
