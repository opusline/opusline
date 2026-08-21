<?php

declare(strict_types=1);

use App\Domain\Clients\Enums\ClientType;
use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Enums\InvoiceForecastBucket;
use App\Domain\Invoices\Enums\InvoiceTodoKind;
use App\Domain\Missions\Enums\EntryRounding;
use App\Domain\Missions\Enums\MissionStatus;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

beforeEach(function (): void {
    $this->travelTo(CarbonImmutable::parse('2026-08-13'));
});

test('totals what is still owed, gross', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'due_on' => '2026-09-30',
        'amount_ttc_cents' => 100_000,
    ]));
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'due_on' => '2026-09-30',
        'amount_ttc_cents' => 44_800,
    ]));

    $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('month', '2026-08')
        ->assertJsonPath('toCollect.amount.amount', 144_800)
        ->assertJsonPath('toCollect.count', 2);
});

test('leaves drafts and paid invoices out of what is still owed', function (callable $configure): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user, configure: $configure);

    $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('toCollect.amount.amount', 0);
})->with([
    'a draft' => [fn ($factory) => $factory],
    'a paid invoice' => [fn ($factory) => $factory->paid()],
]);

test('carves the overdue slice out of what is owed, worst first', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'due_on' => '2026-08-01',
        'amount_ttc_cents' => 100_000,
    ]));
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'due_on' => '2026-03-19',
        'amount_ttc_cents' => 50_000,
    ]));
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'due_on' => '2026-09-30',
        'amount_ttc_cents' => 900_000,
    ]));

    $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('overdue.amount.amount', 150_000)
        ->assertJsonPath('overdue.count', 2)
        ->assertJsonPath('overdue.maxDaysLate', 147);
});

test('reports no days late when nothing is overdue', function (): void {
    $this->actingAs(User::factory()->create())
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('overdue.count', 0)
        ->assertJsonPath('overdue.maxDaysLate', 0);
});

test('values tracked time that no invoice covers, month by month', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->state([
        'rate_cents' => 55_000,
        'rounding' => EntryRounding::Half,
    ]));

    // A full day and a started morning: 1 + 0.5 days at 550 €.
    TimeEntry::factory()->for($mission, 'mission')->create([
        'user_id' => $user->id,
        'date' => '2026-08-03',
        'duration_minutes' => 420,
    ]);
    TimeEntry::factory()->for($mission, 'mission')->create([
        'user_id' => $user->id,
        'date' => '2026-08-07',
        'duration_minutes' => 120,
    ]);
    TimeEntry::factory()->for($mission, 'mission')->create([
        'user_id' => $user->id,
        'date' => '2026-07-20',
        'duration_minutes' => 420,
    ]);

    $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('monthUnbilled.amount.amount', 82_500)
        ->assertJsonPath('monthUnbilled.count', 1);
});

test('totals unbilled work across missions, whenever it was worked', function (): void {
    $user = User::factory()->create();

    foreach (['2026-07-20', '2026-08-03'] as $date) {
        $mission = missionOwnedBy($user, fn ($factory) => $factory->state([
            'rate_cents' => 55_000,
            'rounding' => EntryRounding::Half,
        ]));

        TimeEntry::factory()->for($mission, 'mission')->create([
            'user_id' => $user->id,
            'date' => $date,
            'duration_minutes' => 420,
        ]);
    }

    // The month card only sees August; the grand total sees July too.
    $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('monthUnbilled.count', 1)
        ->assertJsonPath('unbilled.amount.amount', 110_000)
        ->assertJsonPath('unbilled.count', 2);
});

test('bills overtime as one day, matching the CRA figure', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->state([
        'rate_cents' => 55_000,
        'rounding' => EntryRounding::Half,
    ]));

    // Eight hours on a seven-hour workday: the CRA reports one day, so the
    // amount to invoice is one day too — never 1.5 × TJM.
    TimeEntry::factory()->for($mission, 'mission')->create([
        'user_id' => $user->id,
        'date' => '2026-08-03',
        'duration_minutes' => 480,
    ]);

    $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('monthUnbilled.amount.amount', 55_000);
});

test('counts one period per mission, not per entry', function (): void {
    $user = User::factory()->create();

    foreach (range(1, 2) as $index) {
        $mission = missionOwnedBy($user, fn ($factory) => $factory->state(['rate_cents' => 55_000]));

        TimeEntry::factory()->for($mission, 'mission')->count(3)->create([
            'user_id' => $user->id,
            'date' => '2026-08-0'.$index,
        ]);
    }

    $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('monthUnbilled.count', 2);
});

test('stops counting time once an invoice covers it', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->state(['rate_cents' => 55_000]));
    $invoice = invoiceForMission($user, $mission);

    invoicedTimeEntry($user, $mission, $invoice);

    $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('monthUnbilled.amount.amount', 0)
        ->assertJsonPath('monthUnbilled.count', 0);
});

test('leaves fixed-price and non-billable time out of what is still to invoice', function (callable $arrange): void {
    $user = User::factory()->create();
    $arrange($user);

    $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('monthUnbilled.amount.amount', 0)
        ->assertJsonPath('unbilled.count', 0)
        ->assertJsonPath('todoTotal', 0);
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

test('reads the month from the query', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->state([
        'rate_cents' => 55_000,
        'rounding' => EntryRounding::Half,
    ]));
    TimeEntry::factory()->for($mission, 'mission')->create([
        'user_id' => $user->id,
        'date' => '2026-07-20',
        'duration_minutes' => 420,
    ]);

    $this->actingAs($user)
        ->getJson('/api/invoices/summary?month=2026-07')
        ->assertOk()
        ->assertJsonPath('month', '2026-07')
        ->assertJsonPath('monthUnbilled.amount.amount', 55_000);
});

test('splits what is still expected across the forecast bars', function (): void {
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

    // The 100 000 € already due is reported as `overdue`, never as a bar.
    expect(array_column($forecast, 'bucket'))->toBe([
        InvoiceForecastBucket::Next30->value,
        InvoiceForecastBucket::Next60->value,
    ]);
    expect(array_map(fn (array $bar): int => $bar['amount']['amount'], $forecast))
        ->toBe([200_000, 50_000]);
    // Shares are relative to the largest bar drawn, so it reads 100 %.
    expect(array_column($forecast, 'shareBp'))->toBe([10_000, 2_500]);
});

test('scales the bars against the largest bar, not against overdue money', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'due_on' => '2026-03-01', 'amount_ttc_cents' => 900_000,
    ]));
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'due_on' => '2026-08-20', 'amount_ttc_cents' => 100_000,
    ]));

    $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('forecast.0.shareBp', 10_000);
});

test('keeps invoices waiting to be written when the overdue backlog is long', function (): void {
    $user = User::factory()->create();

    foreach (range(1, 25) as $index) {
        invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
            'due_on' => '2026-06-'.str_pad((string) (($index % 28) + 1), 2, '0', STR_PAD_LEFT),
        ]));
    }

    $mission = missionOwnedBy($user, fn ($factory) => $factory->state(['rate_cents' => 55_000]));
    TimeEntry::factory()->for($mission, 'mission')->create([
        'user_id' => $user->id,
        'date' => '2026-08-03',
    ]);

    $todo = $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->json('todo');

    expect(array_column($todo, 'kind'))->toContain(InvoiceTodoKind::UnbilledWork->value);
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

test('lists what needs attention, money already late first', function (): void {
    $user = User::factory()->create();
    $overdue = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'number' => 'F-2026-036',
        'due_on' => '2026-06-30',
    ]));
    invoiceOwnedBy($user);
    $mission = missionOwnedBy($user, fn ($factory) => $factory->state(['rate_cents' => 55_000]));
    TimeEntry::factory()->for($mission, 'mission')->create([
        'user_id' => $user->id,
        'date' => '2026-08-03',
    ]);

    $todo = $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('todoTotal', 2)
        ->json('todo');

    expect(array_column($todo, 'kind'))->toBe([
        InvoiceTodoKind::Overdue->value,
        InvoiceTodoKind::UnbilledWork->value,
    ]);
    expect($todo[0]['overdue']['invoiceId'])->toBe($overdue->id)
        ->and($todo[0]['overdue']['number'])->toBe('F-2026-036')
        ->and($todo[0]['overdue']['dueOn'])->toBe('2026-06-30')
        ->and($todo[0]['overdue']['daysLate'])->toBe(44)
        ->and($todo[0]['work'])->toBeNull()
        ->and($todo[1]['work']['missionId'])->toBe($mission->id)
        ->and($todo[1]['work']['missionName'])->toBe($mission->name)
        ->and($todo[1]['overdue'])->toBeNull();
});

test('dates unbilled work by the entries behind it', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->state([
        'rate_cents' => 55_000,
        'rounding' => EntryRounding::Half,
    ]));

    foreach (['2026-08-05', '2026-08-03', '2026-08-07'] as $date) {
        TimeEntry::factory()->for($mission, 'mission')->create([
            'user_id' => $user->id,
            'date' => $date,
            'duration_minutes' => 420,
        ]);
    }

    $todo = $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->json('todo.0.work');

    expect($todo['firstEntryOn'])->toBe('2026-08-03')
        ->and($todo['lastEntryOn'])->toBe('2026-08-07')
        ->and($todo['entryCount'])->toBe(3)
        ->and($todo['valuedDays'])->toEqual(3.0)
        ->and($todo['valuedMinutes'])->toBeNull();
});

test('starts unbilled work on the TVA rate its client is billed at', function (): void {
    $user = User::factory()->create();
    vatLiable($user);
    $mission = missionOwnedBy($user);
    $mission->client->update(['default_vat_rate_bp' => 0]);
    TimeEntry::factory()->for($mission, 'mission')->create([
        'user_id' => $user->id,
        'date' => '2026-08-03',
        'duration_minutes' => 420,
    ]);

    $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('todo.0.work.vatRateBp', 0);
});

test('starts unbilled work on the account TVA rate when the client has none', function (): void {
    $user = User::factory()->create();
    vatLiable($user);
    $mission = missionOwnedBy($user);
    TimeEntry::factory()->for($mission, 'mission')->create([
        'user_id' => $user->id,
        'date' => '2026-08-03',
        'duration_minutes' => 420,
    ]);

    $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('todo.0.work.vatRateBp', 2_000);
});

test('measures unbilled work in hours when the mission bills by the hour', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->hourly()->state([
        'rate_cents' => 8_000,
        'rounding' => EntryRounding::Quarter,
    ]));
    TimeEntry::factory()->for($mission, 'mission')->create([
        'user_id' => $user->id,
        'date' => '2026-08-03',
        'duration_minutes' => 67,
    ]);

    $todo = $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->json('todo.0');

    // A started quarter is a billed quarter: 1 h 07 bills as 1 h 15.
    expect($todo['work']['valuedMinutes'])->toBe(75)
        ->and($todo['work']['valuedDays'])->toBeNull()
        ->and($todo['amount']['amount'])->toBe(10_000);
});

test('never counts another user invoices', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy(User::factory()->create(), configure: fn ($factory) => $factory->overdue());

    $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('toCollect.amount.amount', 0)
        ->assertJsonPath('counts.all', 0)
        ->assertJsonPath('todoTotal', 0);
});

test('rejects a malformed month', function (): void {
    $this->actingAs(User::factory()->create())
        ->getJson('/api/invoices/summary?month=aout-2026')
        ->assertUnprocessable()
        ->assertJsonValidationErrors('month');
});

test('puts a forfait past its warning threshold in front of you, with the balance left to bill', function (): void {
    $user = User::factory()->create();
    $mission = forfaitWith($user, forfaitCents: 1_000_000, referenceCents: 48_000, days: 18);
    invoiceForMission($user, $mission, fn ($factory) => $factory->sent()->state(['amount_ht_cents' => 288_000]));
    invoiceForMission($user, $mission, fn ($factory) => $factory->state(['amount_ht_cents' => 144_000]));

    $todo = $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->json('todo.0');

    expect($todo['kind'])->toBe(InvoiceTodoKind::FixedPriceBudget->value)
        ->and($todo['amount']['amount'])->toBe(568_000)
        ->and($todo['budget']['missionId'])->toBe($mission->id)
        ->and($todo['budget']['missionSlug'])->toBe($mission->slug)
        ->and($todo['budget']['clientSlug'])->toBe($mission->client->slug)
        ->and($todo['budget']['budget']['consumption']['consumedShareBp'])->toBe(8_640)
        ->and($todo['work'])->toBeNull();
});

test('reports an overrun forfait as what it costs rather than what is left to bill', function (): void {
    $user = User::factory()->create();
    $mission = forfaitWith($user, forfaitCents: 480_000, referenceCents: 55_000, days: 11);

    $todo = $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('todoTotal', 1)
        ->json('todo.0');

    expect($todo['kind'])->toBe(InvoiceTodoKind::FixedPriceOverrun->value)
        ->and($todo['amount']['amount'])->toBe(125_000);
});

test('says nothing about a forfait that is neither running out nor left to bill', function (callable $arrange): void {
    $user = User::factory()->create();
    $arrange($user);

    $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('todoTotal', 0);
})->with([
    'comfortably within budget' => [function (User $user): void {
        forfaitWith($user, 1_000_000, 48_000, days: 5);
    }],
    'warned but fully invoiced' => [function (User $user): void {
        $mission = forfaitWith($user, 1_000_000, 48_000, days: 18);
        invoiceForMission($user, $mission, fn ($factory) => $factory->sent()->state(['amount_ht_cents' => 1_000_000]));
    }],
    'with no reference rate to read it against' => [function (User $user): void {
        $mission = missionOwnedBy($user, fn ($factory) => $factory->fixed());
        TimeEntry::factory()->for($mission, 'mission')->create(['user_id' => $user->id]);
    }],
    'on an internal client' => [function (User $user): void {
        $client = Client::factory()->for($user)->create(['type' => ClientType::Internal]);
        forfaitWith($user, 480_000, 55_000, days: 11, client: $client);
    }],
]);

test('ranks overdue money, then forfaits, then time left to bill', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'due_on' => '2026-06-30',
        'amount_ttc_cents' => 122_400,
    ]));
    forfaitWith($user, forfaitCents: 480_000, referenceCents: 55_000, days: 11);
    $daily = missionOwnedBy($user, fn ($factory) => $factory->state([
        'rate_cents' => 55_000,
        'rounding' => EntryRounding::Half,
    ]));
    TimeEntry::factory()->for($daily, 'mission')->create([
        'user_id' => $user->id,
        'date' => '2026-08-03',
        'duration_minutes' => 420,
    ]);

    $todo = $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('todoTotal', 3)
        ->json('todo');

    expect(array_column($todo, 'kind'))->toBe([
        InvoiceTodoKind::Overdue->value,
        InvoiceTodoKind::FixedPriceOverrun->value,
        InvoiceTodoKind::UnbilledWork->value,
    ]);
});

test('puts the worst forfait first, whatever the missions are called', function (): void {
    $user = User::factory()->create();
    forfaitWith($user, 1_000_000, 48_000, days: 18, name: 'Alpha refonte');
    forfaitWith($user, 480_000, 55_000, days: 11, name: 'Zephyr vitrine');

    $todo = $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->json('todo');

    expect(array_column(array_column($todo, 'budget'), 'missionName'))
        ->toBe(['Zephyr vitrine', 'Alpha refonte']);
});

test('drops a finished forfait from the list, however far it ran over', function (): void {
    $user = User::factory()->create();
    $mission = forfaitWith($user, 480_000, 55_000, days: 11);
    $mission->update(['status' => MissionStatus::Done]);

    $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('todoTotal', 0);
});

test('splits a full list evenly, then hands the spare rows to the most urgent kind', function (): void {
    $user = User::factory()->create();

    // Eight of each: past the even third, so every kind is capped and the two rows
    // left over by the 20-row limit go to what costs most to ignore.
    for ($index = 0; $index < 8; $index++) {
        invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
            'due_on' => '2026-06-30',
            'amount_ttc_cents' => 100_000,
        ]));

        forfaitWith($user, 100_000, 90_000, days: 1);

        $daily = missionOwnedBy($user, fn ($factory) => $factory->state([
            'rate_cents' => 55_000,
            'rounding' => EntryRounding::Half,
        ]));
        TimeEntry::factory()->for($daily, 'mission')->create([
            'user_id' => $user->id,
            'date' => '2026-08-03',
            'duration_minutes' => 420,
        ]);
    }

    $todo = $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->json('todo');

    $byKind = array_count_values(array_column($todo, 'kind'));

    expect($todo)->toHaveCount(20)
        ->and($byKind[InvoiceTodoKind::Overdue->value])->toBe(8)
        ->and($byKind[InvoiceTodoKind::FixedPriceBudget->value])->toBe(6)
        ->and($byKind[InvoiceTodoKind::UnbilledWork->value])->toBe(6);
});
