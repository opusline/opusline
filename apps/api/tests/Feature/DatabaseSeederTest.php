<?php

declare(strict_types=1);

use App\Domain\Cra\Actions\DescribeCra;
use App\Domain\Cra\Calendar\FrenchHolidays;
use App\Domain\Cra\Enums\CraStatus;
use App\Domain\Invoices\Actions\SummarizeMissionBilling;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Models\Mission;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

test('seeds a demo portfolio for the test user', function (): void {
    $this->seed();

    $user = User::query()->where('email', 'test@example.com')->firstOrFail();

    expect($user->clients)->toHaveCount(6)
        ->and($user->missions)->toHaveCount(6)
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

    // Six on the time-billed missions, plus the two forfait instalments already
    // settled; the third forfait instalment is the extra sent one.
    expect($invoices->where('status', InvoiceStatus::Paid))->toHaveCount(8)
        ->and($invoices->where('status', InvoiceStatus::Sent))->toHaveCount(3)
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

test('the demo account opens the Revenus screen on real figures', function (): void {
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
});

test('the demo account flags exactly one late invoice', function (): void {
    $this->seed();

    $user = User::query()->where('email', 'test@example.com')->firstOrFail();

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

test('seeds a fixed-price mission billed in instalments', function (): void {
    $this->seed();

    $user = User::query()->where('email', 'test@example.com')->firstOrFail();
    $mission = Mission::query()->where('name', 'Orvella refonte')->sole();

    expect($mission->billing_mode)->toBe(BillingMode::Fixed);

    $progress = app(SummarizeMissionBilling::class)->handle($mission);

    expect($progress)->not->toBeNull()
        ->and($progress->fixedPrice->amount)->toBe(800_000)
        ->and($progress->invoiced->amount)->toBe(560_000)
        ->and($progress->remaining->amount)->toBe(240_000)
        ->and($progress->progressBp)->toBe(7000);
});

test('seeds a fixed-price mission billed to the last cent', function (): void {
    $this->seed();

    $user = User::query()->where('email', 'test@example.com')->firstOrFail();
    $mission = Mission::query()->where('name', 'Orvella identité')->sole();

    $progress = app(SummarizeMissionBilling::class)->handle($mission);

    expect($progress->remaining->amount)->toBe(0)
        ->and($progress->progressBp)->toBe(10_000);
});

test('leaves the time tracked on a fixed price uninvoiced and unbilled', function (): void {
    $this->seed();

    $user = User::query()->where('email', 'test@example.com')->firstOrFail();
    $mission = Mission::query()->where('name', 'Orvella refonte')->sole();

    expect($mission->timeEntries()->count())->toBe(21)
        ->and($mission->timeEntries()->whereNotNull('invoice_id')->count())->toBe(0);

    // The demo's whole point: 21 days delivered against 8 000 € is a margin the
    // freelancer can see, and a figure no screen is allowed to turn into revenue.
    // The account does have work to invoice — on the missions that bill time.
    $missionIds = collect($this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->json('todo'))
        ->pluck('work.missionId')
        ->filter()
        ->values()
        ->all();

    expect($missionIds)->not->toBeEmpty()
        ->and($missionIds)->not->toContain($mission->id);
});

test('seeds a payment schedule with one instalment still owed', function (): void {
    $this->seed();

    $user = User::query()->where('email', 'test@example.com')->firstOrFail();
    $mission = Mission::query()->where('name', 'Orvella refonte')->sole();
    $steps = $mission->billingSteps()->get();

    expect($steps)->toHaveCount(3)
        ->and($steps->whereNull('invoice_id'))->toHaveCount(1);

    // Overdue invoices lead the list on purpose, so the step is found by kind
    // rather than by position.
    $labels = collect($this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->json('todo'))
        ->pluck('step.label')
        ->filter()
        ->values()
        ->all();

    expect($labels)->toBe(['Mise en production']);
});
