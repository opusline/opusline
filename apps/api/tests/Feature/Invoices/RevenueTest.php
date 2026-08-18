<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

test('totals the month invoiced revenue net and echoes the period', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state(['amount_ht_cents' => 100_000]));
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->paid()->state(['amount_ht_cents' => 44_800]));

    $this->actingAs($user)
        ->getJson('/api/revenue')
        ->assertOk()
        ->assertJsonPath('period', '2026-08')
        ->assertJsonPath('basis', 0)
        ->assertJsonPath('fellBack', false)
        ->assertJsonPath('total.amount', 144_800);
});

test('leaves drafts out of invoiced revenue', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user);

    $this->actingAs($user)
        ->getJson('/api/revenue')
        ->assertOk()
        ->assertJsonPath('total.amount', 0)
        ->assertJsonPath('lastActivePeriod', null);
});

test('totals collected revenue by payment date', function (): void {
    $user = User::factory()->create();
    // Issued in June, paid in August: cash lands in August.
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->paid()->state([
        'issued_on' => '2026-06-01',
        'paid_on' => '2026-08-10',
        'amount_ht_cents' => 100_000,
    ]));
    // Sent but unpaid: invoiced revenue, not collected.
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state(['amount_ht_cents' => 50_000]));

    $this->actingAs($user)
        ->getJson('/api/revenue?basis=1')
        ->assertOk()
        ->assertJsonPath('basis', 1)
        ->assertJsonPath('total.amount', 100_000);
});

test('reads a quarter and sums its three months', function (): void {
    $user = User::factory()->create();

    foreach (['2026-07-10', '2026-08-05', '2026-09-28'] as $issuedOn) {
        invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
            'issued_on' => $issuedOn,
            'amount_ht_cents' => 100_000,
        ]));
    }

    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-06-30',
        'amount_ht_cents' => 900_000,
    ]));

    $this->actingAs($user)
        ->getJson('/api/revenue?period=2026-Q3')
        ->assertOk()
        ->assertJsonPath('period', '2026-Q3')
        ->assertJsonPath('total.amount', 300_000);
});

test('reads a year', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-01-15',
        'amount_ht_cents' => 100_000,
    ]));
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'issued_on' => '2025-12-31',
        'amount_ht_cents' => 900_000,
    ]));

    $this->actingAs($user)
        ->getJson('/api/revenue?period=2026')
        ->assertOk()
        ->assertJsonPath('period', '2026')
        ->assertJsonPath('total.amount', 100_000);
});

test('compares against the previous period', function (string $period, string $currentIssuedOn, string $previousIssuedOn, string $previousPeriod): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'issued_on' => $currentIssuedOn,
        'amount_ht_cents' => 100_000,
    ]));
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'issued_on' => $previousIssuedOn,
        'amount_ht_cents' => 80_000,
    ]));

    $this->actingAs($user)
        ->getJson('/api/revenue?period='.$period)
        ->assertOk()
        ->assertJsonPath('previous.period', $previousPeriod)
        ->assertJsonPath('previous.total.amount', 80_000)
        ->assertJsonPath('previous.changeBp', 2_500);
})->with([
    'month' => ['2026-07', '2026-07-10', '2026-06-20', '2026-06'],
    'quarter' => ['2026-Q3', '2026-08-05', '2026-05-15', '2026-Q2'],
    'year' => ['2026', '2026-03-01', '2025-11-30', '2025'],
]);

test('reports no comparison when the previous period is empty', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state(['amount_ht_cents' => 100_000]));

    $this->actingAs($user)
        ->getJson('/api/revenue')
        ->assertOk()
        ->assertJsonPath('previous.period', '2026-07')
        ->assertJsonPath('previous.total.amount', 0)
        ->assertJsonPath('previous.changeBp', null);
});

test('falls back to the last active month when nothing was asked and the current month is empty', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-06-20',
        'amount_ht_cents' => 100_000,
    ]));

    $this->actingAs($user)
        ->getJson('/api/revenue')
        ->assertOk()
        ->assertJsonPath('period', '2026-06')
        ->assertJsonPath('fellBack', true)
        ->assertJsonPath('lastActivePeriod', '2026-06')
        ->assertJsonPath('total.amount', 100_000);
});

test('never falls back from an explicit period', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-06-20',
        'amount_ht_cents' => 100_000,
    ]));

    $this->actingAs($user)
        ->getJson('/api/revenue?period=2026-08')
        ->assertOk()
        ->assertJsonPath('period', '2026-08')
        ->assertJsonPath('fellBack', false)
        ->assertJsonPath('total.amount', 0)
        ->assertJsonPath('lastActivePeriod', '2026-06');
});

test('reports no last active period on a silent account', function (): void {
    $this->actingAs(User::factory()->create())
        ->getJson('/api/revenue')
        ->assertOk()
        ->assertJsonPath('period', '2026-08')
        ->assertJsonPath('fellBack', false)
        ->assertJsonPath('lastActivePeriod', null)
        ->assertJsonPath('total.amount', 0);
});

test('hides VAT for the franchise en base', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent());

    $this->actingAs($user)
        ->getJson('/api/revenue')
        ->assertOk()
        ->assertJsonPath('vat', null);
});

test('sums VAT from each invoice own rate', function (): void {
    $user = User::factory()->create();
    vatLiable($user);
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'amount_ht_cents' => 100_000,
        'amount_ttc_cents' => 120_000,
        'vat_rate_bp' => 2_000,
    ]));
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'amount_ht_cents' => 100_000,
        'amount_ttc_cents' => 110_000,
        'vat_rate_bp' => 1_000,
    ]));

    $this->actingAs($user)
        ->getJson('/api/revenue')
        ->assertOk()
        ->assertJsonPath('vat.amount.amount', 30_000);
});

test('drops the VAT rate caption once the period mixes rates', function (): void {
    $user = User::factory()->create();
    vatLiable($user);
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'vat_rate_bp' => 2_000,
    ]));
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'vat_rate_bp' => 0,
    ]));

    $this->actingAs($user)
        ->getJson('/api/revenue')
        ->assertOk()
        ->assertJsonPath('vat.rateBp', null);
});

test('captions the VAT with the one rate the period agrees on', function (): void {
    $user = User::factory()->create();
    vatLiable($user);
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'vat_rate_bp' => 1_000,
    ]));

    $this->actingAs($user)
        ->getJson('/api/revenue')
        ->assertOk()
        ->assertJsonPath('vat.rateBp', 1_000);
});

test('estimates net after contributions', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['contribution_rate_bp' => 2_600]);
    // 12 345 × 26 % = 3 209,70 — the half cent rounds up.
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state(['amount_ht_cents' => 12_345]));

    $this->actingAs($user)
        ->getJson('/api/revenue')
        ->assertOk()
        ->assertJsonPath('net.contributions.amount', 3_210)
        ->assertJsonPath('net.amount.amount', 9_135)
        ->assertJsonPath('net.rateBp', 2_600);
});

test('hides the net estimation abroad', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['business_country' => 'DE']);
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent());

    $this->actingAs($user)
        ->getJson('/api/revenue')
        ->assertOk()
        ->assertJsonPath('net', null);
});

test('draws eight monthly bars ending at the selected month', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state(['amount_ht_cents' => 100_000]));

    $months = $this->actingAs($user)
        ->getJson('/api/revenue?period=2026-08')
        ->assertOk()
        ->json('months');

    expect(array_column($months, 'month'))->toBe([
        '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08',
    ]);
    expect(array_column($months, 'inPeriod'))->toBe([
        false, false, false, false, false, false, false, true,
    ]);
});

test('anchors the chart window on the period', function (string $period, string $firstMonth, string $lastMonth, int $count, int $inPeriod): void {
    $user = User::factory()->create();

    $months = $this->actingAs($user)
        ->getJson('/api/revenue?period='.$period)
        ->assertOk()
        ->json('months');

    expect($months)->toHaveCount($count)
        ->and($months[0]['month'])->toBe($firstMonth)
        ->and($months[$count - 1]['month'])->toBe($lastMonth)
        ->and(count(array_filter(array_column($months, 'inPeriod'))))->toBe($inPeriod);
})->with([
    'a quarter ends at the quarter end' => ['2026-Q3', '2026-02', '2026-09', 8, 3],
    'a year shows its twelve months' => ['2026', '2026-01', '2026-12', 12, 12],
]);

test('scales bars to the tallest month', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-07-10',
        'amount_ht_cents' => 200_000,
    ]));
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-08-05',
        'amount_ht_cents' => 100_000,
    ]));

    $months = $this->actingAs($user)
        ->getJson('/api/revenue?period=2026-08')
        ->assertOk()
        ->json('months');

    expect($months[6]['shareBp'])->toBe(10_000)
        ->and($months[7]['shareBp'])->toBe(5_000);
});

test('reports zero shares on an empty window', function (): void {
    $months = $this->actingAs(User::factory()->create())
        ->getJson('/api/revenue?period=2026-08')
        ->assertOk()
        ->json('months');

    expect(array_unique(array_column($months, 'shareBp')))->toBe([0]);
});

test('lists the period invoices newest first with their client and mission', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    $early = invoiceForMission($user, $mission, fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-08-05',
    ]));
    $late = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-08-20',
    ]));

    $invoices = $this->actingAs($user)
        ->getJson('/api/revenue')
        ->assertOk()
        ->json('invoices');

    expect(array_column(array_column($invoices, 'invoice'), 'id'))->toBe([$late->id, $early->id])
        ->and($invoices[1]['client']['name'])->toBe($mission->client->name)
        ->and($invoices[1]['mission']['name'])->toBe($mission->name)
        ->and($invoices[0]['mission'])->toBeNull();
});

test('breaks revenue down by client with shares, largest first', function (): void {
    $user = User::factory()->create();
    $small = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state(['amount_ht_cents' => 25_000]));
    $big = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state(['amount_ht_cents' => 60_000]));
    invoiceOwnedBy($user, $big->client, fn ($factory) => $factory->sent()->state(['amount_ht_cents' => 40_000]));

    $clients = $this->actingAs($user)
        ->getJson('/api/revenue')
        ->assertOk()
        ->json('clients');

    expect($clients)->toHaveCount(2)
        ->and($clients[0]['clientId'])->toBe($big->client_id)
        ->and($clients[0]['clientName'])->toBe($big->client->name)
        ->and($clients[0]['color'])->toBe($big->client->color->value)
        ->and($clients[0]['invoiceCount'])->toBe(2)
        ->and($clients[0]['total']['amount'])->toBe(100_000)
        ->and($clients[0]['shareBp'])->toBe(8_000)
        ->and($clients[1]['clientId'])->toBe($small->client_id)
        ->and($clients[1]['shareBp'])->toBe(2_000);
});

test('never counts another user invoices', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy(User::factory()->create(), configure: fn ($factory) => $factory->paid()->state(['amount_ht_cents' => 900_000]));

    $this->actingAs($user)
        ->getJson('/api/revenue')
        ->assertOk()
        ->assertJsonPath('total.amount', 0)
        ->assertJsonPath('lastActivePeriod', null)
        ->assertJsonPath('invoices', [])
        ->assertJsonPath('clients', []);
});

test('rejects a malformed period', function (): void {
    $this->actingAs(User::factory()->create())
        ->getJson('/api/revenue?period=T3-2026')
        ->assertUnprocessable()
        ->assertJsonValidationErrors('period');
});

test('rejects a malformed basis', function (): void {
    $this->actingAs(User::factory()->create())
        ->getJson('/api/revenue?basis=7')
        ->assertUnprocessable()
        ->assertJsonValidationErrors('basis');
});
