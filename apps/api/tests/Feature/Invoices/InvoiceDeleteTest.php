<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;

test('deletes a draft invoice', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user);

    $this->actingAs($user)
        ->deleteJson("/api/invoices/{$invoice->id}")
        ->assertNoContent();

    $this->assertDatabaseMissing('invoices', ['id' => $invoice->id]);
});

test('releases the time it billed when a draft is deleted', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    $invoice = invoiceForMission($user, $mission);

    $timeEntry = invoicedTimeEntry($user, $mission, $invoice);

    $this->actingAs($user)
        ->deleteJson("/api/invoices/{$invoice->id}")
        ->assertNoContent();

    $this->assertDatabaseHas('time_entries', ['id' => $timeEntry->id, 'invoice_id' => null]);
});

test('refuses to delete an issued invoice', function (string $state): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->{$state}());

    $this->actingAs($user)
        ->deleteJson("/api/invoices/{$invoice->id}")
        ->assertConflict()
        ->assertJsonPath('message', __('invoices.cannot_delete_issued'));

    $this->assertDatabaseHas('invoices', ['id' => $invoice->id]);
})->with(['sent', 'paid']);
