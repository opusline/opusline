<?php

declare(strict_types=1);

use App\Domain\Bank\Factories\BankMatchFactory;
use App\Domain\Bank\Factories\BankMovementFactory;
use App\Domain\Invoices\Enums\InvoiceSource;
use App\Domain\Invoices\Factories\InvoiceFactory;
use App\Domain\Users\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

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

test('refuses to delete an invoice issued in Opusline', function (string $state): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn (InvoiceFactory $factory) => $factory->{$state}()->state([
        'source' => InvoiceSource::Opusline,
    ]));

    $this->actingAs($user)
        ->deleteJson("/api/invoices/{$invoice->id}")
        ->assertConflict()
        ->assertJsonPath('message', __('invoices.cannot_delete_issued'));

    $this->assertDatabaseHas('invoices', ['id' => $invoice->id]);
})->with(['sent', 'paid']);

test('deletes a sent invoice recorded from another tool', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn (InvoiceFactory $factory): InvoiceFactory => $factory->sent());

    $this->actingAs($user)
        ->deleteJson("/api/invoices/{$invoice->id}")
        ->assertNoContent();

    $this->assertDatabaseMissing('invoices', ['id' => $invoice->id]);
});

test('releases the time a deleted invoice from another tool billed', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    $invoice = invoiceForMission($user, $mission, fn (InvoiceFactory $factory): InvoiceFactory => $factory->sent());
    $timeEntry = invoicedTimeEntry($user, $mission, $invoice);

    $this->actingAs($user)
        ->deleteJson("/api/invoices/{$invoice->id}")
        ->assertNoContent();

    $this->assertDatabaseHas('time_entries', ['id' => $timeEntry->id, 'invoice_id' => null]);
});

test('removes the filed document along with an invoice from another tool', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn (InvoiceFactory $factory): InvoiceFactory => $factory->sent());

    $this->actingAs($user)
        ->postJson("/api/invoices/{$invoice->id}/document", [
            'file' => UploadedFile::fake()->create('facture.pdf', 90, 'application/pdf'),
        ])
        ->assertCreated();

    $this->actingAs($user)
        ->deleteJson("/api/invoices/{$invoice->id}")
        ->assertNoContent();

    expect($invoice->client->media()->where('collection_name', 'documents')->count())->toBe(0);
});

test('drops an unvalidated bank suggestion along with an invoice from another tool', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn (InvoiceFactory $factory): InvoiceFactory => $factory->sent());
    $match = bankMatchFor($user, $invoice);

    $this->actingAs($user)
        ->deleteJson("/api/invoices/{$invoice->id}")
        ->assertNoContent();

    $this->assertDatabaseMissing('bank_matches', ['id' => $match->id]);
    $this->assertDatabaseMissing('invoices', ['id' => $invoice->id]);
});

test('refuses to delete an invoice from another tool once paid', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn (InvoiceFactory $factory): InvoiceFactory => $factory->paid());

    $this->actingAs($user)
        ->deleteJson("/api/invoices/{$invoice->id}")
        ->assertConflict()
        ->assertJsonPath('message', __('invoices.cannot_delete_with_money'));

    $this->assertDatabaseHas('invoices', ['id' => $invoice->id]);
});

test('refuses to delete an invoice from another tool with a partial payment', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn (InvoiceFactory $factory): InvoiceFactory => $factory->sent());
    $invoice->payments()->create([
        'user_id' => $user->id,
        'currency' => $invoice->currency,
        'amount_cents' => 10_000,
        'paid_on' => today(),
    ]);

    $this->actingAs($user)
        ->deleteJson("/api/invoices/{$invoice->id}")
        ->assertConflict()
        ->assertJsonPath('message', __('invoices.cannot_delete_with_money'));
});

test('refuses to delete an invoice from another tool a bank transaction was matched to', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn (InvoiceFactory $factory): InvoiceFactory => $factory->sent());
    bankMatchFor($user, $invoice, configure: fn (BankMatchFactory $factory): BankMatchFactory => $factory->validated());

    $this->actingAs($user)
        ->deleteJson("/api/invoices/{$invoice->id}")
        ->assertConflict()
        ->assertJsonPath('message', __('invoices.cannot_delete_with_money'));
});

test('refuses to delete an invoice from another tool a bank transaction is booked against', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn (InvoiceFactory $factory): InvoiceFactory => $factory->sent());
    bankMovementFor($user, configure: fn (BankMovementFactory $factory) => $factory->state([
        'invoice_id' => $invoice->id,
    ]));

    $this->actingAs($user)
        ->deleteJson("/api/invoices/{$invoice->id}")
        ->assertConflict()
        ->assertJsonPath('message', __('invoices.cannot_delete_with_money'));
});

test('tells the screen whether the invoice may be deleted', function (string $state, bool $canBeDeleted): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn (InvoiceFactory $factory) => match ($state) {
        'draft' => $factory,
        'external sent' => $factory->sent(),
        'external paid' => $factory->paid(),
        'opusline sent' => $factory->sent()->state(['source' => InvoiceSource::Opusline]),
    });

    $this->actingAs($user)
        ->getJson("/api/invoices/{$invoice->id}")
        ->assertOk()
        ->assertJsonPath('canBeDeleted', $canBeDeleted);
})->with([
    ['draft', true],
    ['external sent', true],
    ['external paid', false],
    ['opusline sent', false],
]);
