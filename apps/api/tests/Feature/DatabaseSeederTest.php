<?php

declare(strict_types=1);

use App\Domain\Cra\Actions\DescribeCra;
use App\Domain\Cra\Calendar\FrenchHolidays;
use App\Domain\Cra\Enums\CraStatus;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

test('seeds a demo portfolio for the test user', function (): void {
    $this->seed();

    $user = User::query()->where('email', 'test@example.com')->firstOrFail();

    expect($user->clients)->toHaveCount(5)
        ->and($user->missions)->toHaveCount(4)
        ->and($user->timeEntries)->not->toBeEmpty()
        ->and($user->clients->every(fn ($client): bool => $client->slug !== ''))->toBeTrue();
});

test('seeds a sent CRA so the comptes rendus screen has both piles', function (): void {
    $this->seed();

    $user = User::query()->where('email', 'test@example.com')->firstOrFail();
    $cra = $user->cras()->with(['days', 'mission'])->firstOrFail();

    $holidays = new FrenchHolidays()->between($cra->month->startOfMonth(), $cra->month->endOfMonth());

    expect($cra->status)->toBe(CraStatus::Sent)
        ->and($cra->mission->name)->toBe('Callisto front')
        ->and($cra->month->toDateString())->toBe(CarbonImmutable::today()->startOfMonth()->subMonth()->toDateString())
        ->and($cra->days)->not->toBeEmpty()
        ->and($cra->days->every(
            fn ($day): bool => ! $day->date->isWeekend(),
        ))->toBeTrue()
        ->and($cra->days->every(
            fn ($day): bool => ! isset($holidays[$day->date->toDateString()]),
        ))->toBeTrue()
        // The two seeders write to the same mission, and the recent-entries walk must
        // stop at the month boundary — otherwise it double-books days the CRA already
        // reports and the demo account opens on a CRA that contradicts its own tracked
        // time.
        ->and(app(DescribeCra::class)->handle($cra)->differenceDays)->toBe(0.0);
});

test('seeds a running timer so the topbar chip has something to render', function (): void {
    $this->seed();

    $user = User::query()->where('email', 'test@example.com')->firstOrFail();
    $timer = $user->runningTimer()->with('mission')->firstOrFail();

    expect($timer->isPaused())->toBeFalse()
        ->and($timer->elapsedSeconds())->toBeGreaterThanOrEqual(7_000)
        ->and($timer->mission->name)->toBe('Lunaprint maintenance');
});

test('seeds an invoice ladder in every state the screens know', function (): void {
    $this->seed();

    $user = User::query()->where('email', 'test@example.com')->firstOrFail();
    $invoices = $user->invoices()->get();

    $issued = $invoices->where('status', '!==', InvoiceStatus::Draft);

    expect($invoices->where('status', InvoiceStatus::Paid))->toHaveCount(6)
        ->and($invoices->where('status', InvoiceStatus::Sent))->toHaveCount(2)
        ->and($invoices->where('status', InvoiceStatus::Draft))->toHaveCount(1)
        // References are unique and assigned in issue order, drafts stay blank.
        ->and($issued->every(fn ($invoice): bool => $invoice->number !== null))->toBeTrue()
        ->and($issued->pluck('number')->unique())->toHaveCount($issued->count())
        ->and($invoices->where('status', InvoiceStatus::Draft)->every(
            fn ($invoice): bool => $invoice->number === null,
        ))->toBeTrue();
});

test('prices last month invoice from its own tracked time and links it', function (?string $today): void {
    if ($today !== null) {
        $this->travelTo(CarbonImmutable::parse($today));
    }

    $this->seed();

    $user = User::query()->where('email', 'test@example.com')->firstOrFail();
    $craMonth = CarbonImmutable::today()->startOfMonth()->subMonth();
    $invoice = $user->invoices()
        ->where('period_start', $craMonth->toDateString())
        ->sole();

    expect($invoice->status)->toBe(InvoiceStatus::Sent)
        ->and($invoice->timeEntries()->count())->toBeGreaterThan(0)
        // Nothing from the CRA month is left dangling as still to invoice.
        ->and($user->timeEntries()
            ->where('mission_id', $invoice->mission_id)
            ->whereNull('invoice_id')
            ->whereBetween('date', [$craMonth->toDateString(), $craMonth->endOfMonth()->toDateString()])
            ->count())->toBe(0);
})->with([
    'today' => [null],
    // subMonth from the 30th overflows past February — the day the CRA seeder
    // and the invoice seeder used to disagree about which month is "last".
    'a month-end day' => ['2026-03-30'],
]);

test('the demo account opens the Revenus and Factures screens on real figures', function (): void {
    $this->seed();

    $user = User::query()->where('email', 'test@example.com')->firstOrFail();

    $revenue = $this->actingAs($user)
        ->getJson('/api/revenue')
        ->assertOk()
        ->assertJsonPath('fellBack', false)
        // The persona is VAT-liable, so the TVA card has something to say.
        ->assertJsonPath('vat.rateBp', 2_000)
        ->json();

    expect($revenue['total']['amount'])->toBeGreaterThan(0)
        ->and($revenue['previous']['changeBp'])->not->toBeNull();

    $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('counts.late', 1);
});

test('seeds time on a non-billable mission so the week grid shows one', function (): void {
    $this->seed();

    $user = User::query()->where('email', 'test@example.com')->firstOrFail();
    $nonBillable = $user->missions()
        ->whereNull('rate_cents')
        ->with('timeEntries')
        ->firstOrFail();

    expect($nonBillable->timeEntries)->not->toBeEmpty()
        ->and($nonBillable->timeEntries->every(
            fn ($entry): bool => $entry->note !== null,
        ))->toBeTrue()
        ->and($nonBillable->timeEntries->every(
            fn ($entry): bool => $entry->billable === false,
        ))->toBeTrue();
});
