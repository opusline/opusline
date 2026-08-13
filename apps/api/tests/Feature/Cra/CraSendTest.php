<?php

declare(strict_types=1);

use App\Domain\Cra\Enums\CraStatus;
use App\Domain\Documents\Enums\DocumentCategory;
use App\Domain\Users\Models\User;

test('hands the month to the client and files the document it produced', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user);
    $cra = craDays(
        craOwnedBy($user, $mission, fn ($factory) => $factory->forMonth('2026-07')),
        ['2026-07-06' => 10_000, '2026-07-07' => 5_000],
    );

    $this->actingAs($user)
        ->postJson("/api/cras/{$cra->id}/send")
        ->assertOk()
        ->assertJsonPath('cra.status', CraStatus::Sent->value)
        ->assertJsonPath('cra.sentOn', now()->toDateString())
        ->assertJsonPath('cra.editable', false);

    $document = $mission->media()->where('collection_name', 'documents')->sole();

    expect($document->getCustomProperty('category'))->toBe(DocumentCategory::Cra->value)
        ->and($document->file_name)->toBe("CRA-{$mission->slug}-2026-07.pdf");
});

test('records a back-dated send', function (): void {
    $user = User::factory()->create();
    $cra = craDays(
        craOwnedBy($user, null, fn ($factory) => $factory->forMonth('2026-07')),
        ['2026-07-06' => 10_000],
    );

    $this->actingAs($user)
        ->postJson("/api/cras/{$cra->id}/send", ['sentOn' => '2026-08-01'])
        ->assertOk()
        ->assertJsonPath('cra.sentOn', '2026-08-01');
});

test('refuses to send a month that reports nothing', function (): void {
    $user = User::factory()->create();
    $cra = craOwnedBy($user, null, fn ($factory) => $factory->forMonth('2026-07'));

    $this->actingAs($user)
        ->postJson("/api/cras/{$cra->id}/send")
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['days']);

    $this->assertDatabaseHas('cras', ['id' => $cra->id, 'status' => CraStatus::Draft->value]);
});

test('refuses to send the same CRA twice', function (): void {
    $user = User::factory()->create();
    $cra = craDays(
        craOwnedBy($user, null, fn ($factory) => $factory->sent()->forMonth('2026-07')),
        ['2026-07-06' => 10_000],
    );

    $this->actingAs($user)
        ->postJson("/api/cras/{$cra->id}/send")
        ->assertStatus(409);
});

test('freezes the grid once the client holds it', function (): void {
    $user = User::factory()->create();
    $cra = craDays(
        craOwnedBy($user, null, fn ($factory) => $factory->forMonth('2026-07')),
        ['2026-07-06' => 10_000],
    );

    $this->actingAs($user)->postJson("/api/cras/{$cra->id}/send")->assertOk();

    $this->actingAs($user)
        ->putJson("/api/cras/{$cra->id}/days", ['days' => [
            ['date' => '2026-07-08', 'dayFractionBp' => 10_000],
        ]])
        ->assertStatus(409);
});

test('rejects a post-dated send', function (): void {
    $user = User::factory()->create();
    $cra = craDays(
        craOwnedBy($user, null, fn ($factory) => $factory->forMonth('2026-07')),
        ['2026-07-06' => 10_000],
    );

    $this->actingAs($user)
        ->postJson("/api/cras/{$cra->id}/send", ['sentOn' => now()->addWeek()->toDateString()])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['sentOn']);
});

test('cannot send another user CRA', function (): void {
    $user = User::factory()->create();
    $cra = craOwnedBy(User::factory()->create());

    $this->actingAs($user)
        ->postJson("/api/cras/{$cra->id}/send")
        ->assertNotFound();
});

test('returns 401 for guests', function (): void {
    $cra = craOwnedBy(User::factory()->create());

    $this->postJson("/api/cras/{$cra->id}/send")->assertUnauthorized();
});
