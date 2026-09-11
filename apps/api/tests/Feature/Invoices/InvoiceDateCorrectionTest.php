<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

beforeEach(fn () => freezeTodayAtUtcNoon());

test('moves the date an invoice was sent on', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-08-01',
    ]));
    $invoice->events()->create(['kind' => InvoiceEventKind::Sent, 'occurred_on' => '2026-08-01']);

    $history = $this->actingAs($user)
        ->patchJson("/api/invoices/{$invoice->id}/dates", ['sentOn' => '2026-08-04'])
        ->assertOk()
        ->json('history');

    expect(collect($history)->firstWhere('kind', InvoiceEventKind::Sent->value))
        ->toMatchArray(['occurredOn' => '2026-08-04']);
});

test('writes the send date down even when the invoice never recorded one', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-08-01',
    ]));

    $history = $this->actingAs($user)
        ->patchJson("/api/invoices/{$invoice->id}/dates", ['sentOn' => '2026-08-06'])
        ->assertOk()
        ->json('history');

    expect(collect($history)->firstWhere('kind', InvoiceEventKind::Sent->value))
        ->toMatchArray(['occurredOn' => '2026-08-06']);
});

test('moves a payment date backwards', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->paid()->state([
        'issued_on' => '2026-08-01',
        'paid_on' => '2026-08-12',
    ]));

    $this->actingAs($user)
        ->patchJson("/api/invoices/{$invoice->id}/dates", ['paidOn' => '2026-08-05'])
        ->assertOk()
        ->assertJsonPath('invoice.paidOn', '2026-08-05');

    expect($invoice->refresh()->paid_on->toDateString())->toBe('2026-08-05');
});

test('keeps the paid event on the date the money landed', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->paid()->state([
        'issued_on' => '2026-08-01',
        'paid_on' => '2026-08-12',
    ]));
    $invoice->events()->create(['kind' => InvoiceEventKind::Paid, 'occurred_on' => '2026-08-12']);

    $history = $this->actingAs($user)
        ->patchJson("/api/invoices/{$invoice->id}/dates", ['paidOn' => '2026-08-05'])
        ->assertOk()
        ->json('history');

    expect(collect($history)->firstWhere('kind', InvoiceEventKind::Paid->value))
        ->toMatchArray(['occurredOn' => '2026-08-05']);
});

test('records the correction of a payment date in the history', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->paid()->state([
        'issued_on' => '2026-08-01',
        'paid_on' => '2026-08-12',
    ]));

    $history = $this->actingAs($user)
        ->patchJson("/api/invoices/{$invoice->id}/dates", ['paidOn' => '2026-08-05'])
        ->assertOk()
        ->json('history');

    expect(array_column($history, 'kind'))->toContain(InvoiceEventKind::Updated->value);
});

test('leaves the history alone when only the send date moves', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-08-01',
    ]));

    $history = $this->actingAs($user)
        ->patchJson("/api/invoices/{$invoice->id}/dates", ['sentOn' => '2026-08-03'])
        ->assertOk()
        ->json('history');

    expect(array_column($history, 'kind'))->not->toContain(InvoiceEventKind::Updated->value);
});

test('refuses to correct the dates of a draft', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user);

    $this->actingAs($user)
        ->patchJson("/api/invoices/{$invoice->id}/dates", ['sentOn' => '2026-08-03'])
        ->assertConflict()
        ->assertJsonPath('message', __('invoices.cannot_correct_dates_unless_issued'));
});

test('refuses a payment date on an invoice that was never paid', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent());

    $this->actingAs($user)
        ->patchJson("/api/invoices/{$invoice->id}/dates", ['paidOn' => '2026-08-03'])
        ->assertConflict()
        ->assertJsonPath('message', __('invoices.paid_on_without_payment'));
});

test('refuses a send date before the invoice was issued', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-08-05',
    ]));

    $this->actingAs($user)
        ->patchJson("/api/invoices/{$invoice->id}/dates", ['sentOn' => '2026-08-04'])
        ->assertConflict()
        ->assertJsonPath('message', __('invoices.sent_on_before_issued'));
});

test('refuses a send date later than the payment it already has', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->paid()->state([
        'issued_on' => '2026-08-01',
        'paid_on' => '2026-08-03',
    ]));
    $invoice->events()->create(['kind' => InvoiceEventKind::Sent, 'occurred_on' => '2026-08-01']);

    $this->actingAs($user)
        ->patchJson("/api/invoices/{$invoice->id}/dates", ['sentOn' => '2026-08-06'])
        ->assertConflict()
        ->assertJsonPath('message', __('invoices.paid_on_before_sent'));
});

test('refuses a date in the future', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent());

    $this->actingAs($user)
        ->patchJson("/api/invoices/{$invoice->id}/dates", [
            'sentOn' => CarbonImmutable::today()->addDay()->toDateString(),
        ])
        ->assertStatus(422)
        ->assertJsonValidationErrors('sentOn');
});

test('refuses a correction that names no date at all', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent());

    $this->actingAs($user)
        ->patchJson("/api/invoices/{$invoice->id}/dates", [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['sentOn', 'paidOn']);
});

test('moves the day the invoice bears, which the other two stand on', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-08-31',
    ]));

    $this->actingAs($user)
        ->patchJson("/api/invoices/{$invoice->id}/dates", [
            'issuedOn' => '2026-07-31',
            'sentOn' => '2026-08-02',
        ])
        ->assertOk()
        ->assertJsonPath('invoice.issuedOn', '2026-07-31');

    expect($invoice->refresh()->issued_on->toDateString())->toBe('2026-07-31');
});

test('carries the due date along when it was derived from the terms', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create([
        'payment_terms_days' => 30,
    ]);
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'client_id' => $client->id,
        'issued_on' => '2026-08-31',
        'due_on' => '2026-09-30',
    ]));

    $this->actingAs($user)
        ->patchJson("/api/invoices/{$invoice->id}/dates", ['issuedOn' => '2026-07-31'])
        ->assertOk()
        ->assertJsonPath('invoice.dueOn', '2026-08-30');
});

test('leaves a due date somebody set by hand where it is', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create([
        'payment_terms_days' => 30,
    ]);
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'client_id' => $client->id,
        'issued_on' => '2026-08-31',
        'due_on' => '2026-12-24',
    ]));

    $this->actingAs($user)
        ->patchJson("/api/invoices/{$invoice->id}/dates", ['issuedOn' => '2026-07-31'])
        ->assertOk()
        ->assertJsonPath('invoice.dueOn', '2026-12-24');
});

test('refuses an issue date that would leave the send behind it', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-08-01',
    ]));

    $this->actingAs($user)
        ->patchJson("/api/invoices/{$invoice->id}/dates", ['sentOn' => '2026-08-04'])
        ->assertOk();

    $this->actingAs($user)
        ->patchJson("/api/invoices/{$invoice->id}/dates", ['issuedOn' => '2026-08-10'])
        ->assertConflict()
        ->assertJsonPath('message', __('invoices.sent_on_before_issued'));
});

test('records the correction as history, because the issue date is fiscal', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-08-31',
    ]));

    $this->actingAs($user)
        ->patchJson("/api/invoices/{$invoice->id}/dates", ['issuedOn' => '2026-07-31'])
        ->assertOk();

    expect($invoice->events()->pluck('kind')->all())
        ->toContain(InvoiceEventKind::Updated);
});
