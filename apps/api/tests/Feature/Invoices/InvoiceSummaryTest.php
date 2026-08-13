<?php

declare(strict_types=1);

use App\Domain\Invoices\Enums\InvoiceForecastBucket;
use App\Domain\Invoices\Enums\InvoiceTodoKind;
use App\Domain\Missions\Enums\EntryRounding;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

beforeEach(function (): void {
    $this->travelTo(CarbonImmutable::parse('2026-08-13'));
});

test('totals what was invoiced in the month, net of TVA', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-08-02',
        'amount_ht_cents' => 100_000,
    ]));
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-07-31',
        'amount_ht_cents' => 500_000,
    ]));

    $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('month', '2026-08')
        ->assertJsonPath('invoiced.amount.amount', 100_000)
        ->assertJsonPath('invoiced.count', 1);
});

test('leaves drafts out of what was invoiced', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->state([
        'issued_on' => '2026-08-02',
        'amount_ht_cents' => 100_000,
    ]));

    $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('invoiced.amount.amount', 0);
});

test('buckets what was collected on the payment date, not the issue date', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->paid()->state([
        'issued_on' => '2026-06-01',
        'paid_on' => '2026-08-05',
        'amount_ttc_cents' => 240_000,
    ]));

    $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('collected.amount.amount', 240_000)
        ->assertJsonPath('invoiced.amount.amount', 0);
});

test('reads the month from the query', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-07-10',
        'amount_ht_cents' => 700_000,
    ]));

    $this->actingAs($user)
        ->getJson('/api/invoices/summary?month=2026-07')
        ->assertOk()
        ->assertJsonPath('month', '2026-07')
        ->assertJsonPath('invoiced.amount.amount', 700_000);
});

test('values tracked time that no invoice covers', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->state([
        'rate_cents' => 55_000,
        'rounding' => EntryRounding::Half,
    ]));

    // A full day and a started morning: 1 + 0.5 days at 550 €.
    TimeEntry::factory()->for($mission, 'mission')->create([
        'user_id' => $user->id,
        'duration_minutes' => 420,
    ]);
    TimeEntry::factory()->for($mission, 'mission')->create([
        'user_id' => $user->id,
        'duration_minutes' => 120,
    ]);

    $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('toInvoice.amount.amount', 82_500)
        ->assertJsonPath('toInvoice.count', 2);
});

test('stops counting time once an invoice covers it', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->state(['rate_cents' => 55_000]));
    $invoice = invoiceForMission($user, $mission);

    invoicedTimeEntry($user, $mission, $invoice);

    $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('toInvoice.amount.amount', 0)
        ->assertJsonPath('toInvoice.count', 0);
});

test('leaves fixed-price and non-billable time out of what is still to invoice', function (callable $arrange): void {
    $user = User::factory()->create();
    $arrange($user);

    $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('toInvoice.amount.amount', 0);
})->with([
    'a fixed-price mission' => [function (User $user): void {
        $mission = missionOwnedBy($user, fn ($factory) => $factory->fixed());
        TimeEntry::factory()->for($mission, 'mission')->create(['user_id' => $user->id]);
    }],
    'a mission with no rate' => [function (User $user): void {
        $mission = missionOwnedBy($user, fn ($factory) => $factory->nonBillable());
        TimeEntry::factory()->for($mission, 'mission')->create(['user_id' => $user->id]);
    }],
    'time marked non-billable' => [function (User $user): void {
        $mission = missionOwnedBy($user, fn ($factory) => $factory->state(['rate_cents' => 55_000]));
        TimeEntry::factory()->for($mission, 'mission')->create([
            'user_id' => $user->id,
            'billable' => false,
        ]);
    }],
]);

test('splits what is expected across the three forecast bars', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'due_on' => '2026-08-01', 'amount_ttc_cents' => 100_000,
    ]));
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'due_on' => '2026-08-20', 'amount_ttc_cents' => 200_000,
    ]));
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'due_on' => '2026-10-01', 'amount_ttc_cents' => 50_000,
    ]));
    // Beyond 60 days: real money, but outside the window rather than in the last bar.
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'due_on' => '2027-01-01', 'amount_ttc_cents' => 900_000,
    ]));

    $forecast = $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->json('forecast');

    expect(array_column($forecast, 'bucket'))->toBe([
        InvoiceForecastBucket::Late->value,
        InvoiceForecastBucket::Next30->value,
        InvoiceForecastBucket::Next60->value,
    ]);
    expect(array_map(fn (array $bar): int => $bar['amount']['amount'], $forecast))
        ->toBe([100_000, 200_000, 50_000]);
    // Shares are relative to the largest bar, so it reads 100 %.
    expect(array_column($forecast, 'shareBp'))->toBe([5_000, 10_000, 2_500]);
});

test('reports zero shares when nothing is outstanding', function (): void {
    $this->actingAs(User::factory()->create())
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('forecast.0.shareBp', 0);
});

test('counts each filter chip', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user);
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent());
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->overdue());
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->paid());

    $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('counts.all', 4)
        ->assertJsonPath('counts.draft', 1)
        ->assertJsonPath('counts.sent', 2)
        ->assertJsonPath('counts.late', 1)
        ->assertJsonPath('counts.paid', 1);
});

test('lists what needs attention, most costly first', function (): void {
    $user = User::factory()->create();
    $overdue = invoiceOwnedBy($user, configure: fn ($factory) => $factory->overdue());
    $draft = invoiceOwnedBy($user);
    $mission = missionOwnedBy($user, fn ($factory) => $factory->state(['rate_cents' => 55_000]));
    TimeEntry::factory()->for($mission, 'mission')->create(['user_id' => $user->id]);

    $todo = $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('todoTotal', 3)
        ->json('todo');

    expect(array_column($todo, 'kind'))->toBe([
        InvoiceTodoKind::Overdue->value,
        InvoiceTodoKind::UnbilledWork->value,
        InvoiceTodoKind::DraftToSend->value,
    ]);
    expect($todo[0]['invoiceId'])->toBe($overdue->id)
        ->and($todo[1]['missionId'])->toBe($mission->id)
        ->and($todo[2]['invoiceId'])->toBe($draft->id);
});

test('never counts another user invoices', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy(User::factory()->create(), configure: fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-08-02',
    ]));

    $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('invoiced.amount.amount', 0)
        ->assertJsonPath('counts.all', 0)
        ->assertJsonPath('todoTotal', 0);
});

test('rejects a malformed month', function (): void {
    $this->actingAs(User::factory()->create())
        ->getJson('/api/invoices/summary?month=aout-2026')
        ->assertUnprocessable()
        ->assertJsonValidationErrors('month');
});
