<?php

declare(strict_types=1);

use App\Domain\Bank\Enums\BankMatchStatus;
use App\Domain\Bank\Factories\BankMovementFactory;
use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Revenue\CollectedInvoices;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

function sentInvoiceFor(User $user, int $htCents = 165_000, int $ttcCents = 198_000): Invoice
{
    return invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-08-01',
        'due_on' => '2026-08-31',
        'currency' => 'EUR',
        'amount_ht_cents' => $htCents,
        'amount_ttc_cents' => $ttcCents,
    ]));
}

test('a payment short of the balance leaves the invoice sent, partly paid', function (): void {
    $user = User::factory()->create();
    $invoice = sentInvoiceFor($user);

    $this->actingAs($user)
        ->postJson("/api/invoices/{$invoice->id}/pay", [
            'paidOn' => '2026-08-10',
            'amount' => ['amount' => 100_000, 'currency' => 'EUR'],
        ])
        ->assertOk()
        ->assertJsonPath('invoice.status', InvoiceStatus::Sent->value)
        ->assertJsonPath('invoice.paidOn', null)
        ->assertJsonPath('invoice.amountPaid.amount', 100_000)
        ->assertJsonPath('invoice.amountDue.amount', 98_000)
        ->assertJsonPath('payments.0.amount.amount', 100_000)
        ->assertJsonPath('payments.0.paidOn', '2026-08-10')
        ->assertJsonPath('payments.0.bankMovementId', null);

    expect($invoice->events()->where('kind', InvoiceEventKind::PaymentRecorded)->exists())->toBeTrue()
        ->and($invoice->events()->where('kind', InvoiceEventKind::Paid)->exists())->toBeFalse();
});

test('the payment that settles the balance pays the invoice, dated that day', function (): void {
    $user = User::factory()->create();
    $invoice = sentInvoiceFor($user);

    $this->actingAs($user)->postJson("/api/invoices/{$invoice->id}/pay", [
        'paidOn' => '2026-08-10',
        'amount' => ['amount' => 100_000, 'currency' => 'EUR'],
    ])->assertOk();

    $this->actingAs($user)
        ->postJson("/api/invoices/{$invoice->id}/pay", ['paidOn' => '2026-09-02'])
        ->assertOk()
        ->assertJsonPath('invoice.status', InvoiceStatus::Paid->value)
        ->assertJsonPath('invoice.paidOn', '2026-09-02')
        ->assertJsonPath('invoice.amountDue.amount', 0)
        ->assertJsonCount(2, 'payments')
        ->assertJsonPath('payments.1.amount.amount', 98_000);

    expect($invoice->events()->where('kind', InvoiceEventKind::Paid)->sole()->occurred_on->toDateString())->toBe('2026-09-02');
});

test('refuses a payment larger than what is still due', function (): void {
    $user = User::factory()->create();
    $invoice = sentInvoiceFor($user);

    $this->actingAs($user)
        ->postJson("/api/invoices/{$invoice->id}/pay", [
            'paidOn' => '2026-08-10',
            'amount' => ['amount' => 198_001, 'currency' => 'EUR'],
        ])
        ->assertStatus(409)
        ->assertJsonPath('message', __('invoices.payment_exceeds_balance'));

    expect($invoice->payments()->count())->toBe(0);
});

test('refuses a payment of nothing', function (): void {
    $user = User::factory()->create();
    $invoice = sentInvoiceFor($user);

    $this->actingAs($user)
        ->postJson("/api/invoices/{$invoice->id}/pay", [
            'paidOn' => '2026-08-10',
            'amount' => ['amount' => 0, 'currency' => 'EUR'],
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrorFor('amount.amount');
});

test('taking the payment back reopens the invoice and frees the bank movement', function (): void {
    $user = User::factory()->create();
    $invoice = sentInvoiceFor($user);
    $movement = bankMovementFor($user, configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->credit(198_000)->on('2026-08-08'));
    $match = bankMatchFor($user, $invoice, $movement);

    $this->actingAs($user)->postJson("/api/bank/matches/{$match->id}/validate")->assertOk();

    $payment = $invoice->payments()->sole();
    expect($invoice->refresh()->status)->toBe(InvoiceStatus::Paid)
        ->and($payment->bank_movement_id)->toBe($movement->id);

    $this->actingAs($user)
        ->deleteJson("/api/invoices/{$invoice->id}/payments/{$payment->id}")
        ->assertOk()
        ->assertJsonPath('invoice.status', InvoiceStatus::Sent->value)
        ->assertJsonPath('invoice.amountDue.amount', 198_000)
        ->assertJsonPath('payments', []);

    expect($movement->refresh()->invoice_id)->toBeNull()
        ->and($match->refresh()->status)->toBe(BankMatchStatus::Dismissed)
        ->and($invoice->events()->where('kind', InvoiceEventKind::Paid)->exists())->toBeFalse()
        ->and($invoice->events()->where('kind', InvoiceEventKind::Updated)->exists())->toBeTrue();
});

test('does not find a payment of another account, nor one of another invoice', function (): void {
    $user = User::factory()->create();
    $invoice = sentInvoiceFor($user);
    $other = invoiceOwnedBy($user, configure: fn ($factory) => $factory->paid('2026-08-10'));
    $foreign = invoiceOwnedBy(User::factory()->create(), configure: fn ($factory) => $factory->paid('2026-08-10'));

    $this->actingAs($user)
        ->deleteJson("/api/invoices/{$invoice->id}/payments/".$other->payments()->sole()->id)
        ->assertNotFound();
    $this->actingAs($user)
        ->deleteJson("/api/invoices/{$foreign->id}/payments/".$foreign->payments()->sole()->id)
        ->assertNotFound();

    expect($other->payments()->count())->toBe(1)
        ->and($foreign->payments()->count())->toBe(1);
});

test('a bank movement for the balance of a partly paid invoice is suggested and settles it', function (): void {
    $user = User::factory()->create();
    $invoice = sentInvoiceFor($user);

    $this->actingAs($user)->postJson("/api/invoices/{$invoice->id}/pay", [
        'paidOn' => '2026-08-10',
        'amount' => ['amount' => 100_000, 'currency' => 'EUR'],
    ])->assertOk();

    $movement = bankMovementFor($user, configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->credit(98_000)->on('2026-09-02')->state(['label' => 'VIR SEPA '.$invoice->number]));
    $match = bankMatchFor($user, $invoice, $movement);

    $this->actingAs($user)->postJson("/api/bank/matches/{$match->id}/validate")->assertOk();

    expect($invoice->refresh()->status)->toBe(InvoiceStatus::Paid)
        ->and($invoice->paidOn()?->toDateString())->toBe('2026-09-02')
        ->and($invoice->payments()->count())->toBe(2);
});

test('each payment collects its share of the HT and the VAT on its own day', function (): void {
    $user = User::factory()->create();
    $invoice = sentInvoiceFor($user, htCents: 100_000, ttcCents: 120_000);

    $this->actingAs($user)->postJson("/api/invoices/{$invoice->id}/pay", [
        'paidOn' => '2026-08-10',
        'amount' => ['amount' => 30_000, 'currency' => 'EUR'],
    ])->assertOk();
    $this->actingAs($user)->postJson("/api/invoices/{$invoice->id}/pay", ['paidOn' => '2026-09-05'])->assertOk();

    $august = [CarbonImmutable::parse('2026-08-01'), CarbonImmutable::parse('2026-08-31')];
    $september = [CarbonImmutable::parse('2026-09-01'), CarbonImmutable::parse('2026-09-30')];
    $collected = CollectedInvoices::paidBetween($user, $august[0], $september[1]);

    expect($collected->htCents(...$august))->toBe(25_000)
        ->and($collected->vatCents(...$august))->toBe(5_000)
        ->and($collected->htCents(...$september))->toBe(75_000)
        ->and($collected->vatCents(...$september))->toBe(15_000)
        ->and($collected->countBetween($august[0], $september[1]))->toBe(1);
});

test('the collected revenue follows the payments, the invoiced revenue the issue date', function (): void {
    $user = User::factory()->create();
    $invoice = sentInvoiceFor($user, htCents: 100_000, ttcCents: 120_000);

    $this->actingAs($user)->postJson("/api/invoices/{$invoice->id}/pay", [
        'paidOn' => '2026-08-10',
        'amount' => ['amount' => 30_000, 'currency' => 'EUR'],
    ])->assertOk();

    $this->actingAs($user)
        ->getJson('/api/revenue?period=2026-08&basis=1')
        ->assertOk()
        ->assertJsonPath('total.amount', 25_000)
        ->assertJsonPath('invoices.0.invoice.amountPaid.amount', 30_000);
    $this->actingAs($user)
        ->getJson('/api/revenue?period=2026-08&basis=0')
        ->assertOk()
        ->assertJsonPath('total.amount', 100_000);
});

test('the per-client open total is what is still due', function (): void {
    $user = User::factory()->create();
    $invoice = sentInvoiceFor($user);

    $this->actingAs($user)->postJson("/api/invoices/{$invoice->id}/pay", [
        'paidOn' => '2026-08-10',
        'amount' => ['amount' => 100_000, 'currency' => 'EUR'],
    ])->assertOk();

    $this->actingAs($user)
        ->getJson('/api/invoices')
        ->assertOk()
        ->assertJsonPath('clientTotals.0.open.amount', 98_000)
        ->assertJsonPath('clientTotals.0.paid.amount', 0);
});
