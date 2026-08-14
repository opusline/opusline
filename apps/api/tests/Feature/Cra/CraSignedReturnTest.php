<?php

declare(strict_types=1);

use App\Domain\Cra\Enums\CraStatus;
use App\Domain\Documents\Enums\DocumentCategory;
use App\Domain\Users\Models\User;
use Illuminate\Http\UploadedFile;

beforeEach(fn () => freezeTodayAtUtcNoon());
test('files the signed copy next to the original it answers', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user);
    $cra = craDays(
        craOwnedBy($user, $mission, fn ($factory) => $factory->sent()->forMonth('2026-07')),
        ['2026-07-06' => 10_000],
    );

    $this->actingAs($user)
        ->postJson("/api/cras/{$cra->id}/signed-document", [
            'file' => UploadedFile::fake()->create('scan.pdf', 90, 'application/pdf'),
        ])
        ->assertCreated()
        ->assertJsonPath('cra.status', CraStatus::Signed->value)
        ->assertJsonPath('cra.signedOn', now()->toDateString());

    $document = $mission->media()->where('collection_name', 'documents')->sole();

    expect($document->getCustomProperty('category'))->toBe(DocumentCategory::SignedCra->value)
        ->and($document->file_name)->toBe("CRA-{$mission->slug}-2026-07-signe.pdf");
});

test('accepts a photograph of a signed page', function (): void {
    $user = User::factory()->create();
    $cra = craDays(
        craOwnedBy($user, null, fn ($factory) => $factory->sent()->forMonth('2026-07')),
        ['2026-07-06' => 10_000],
    );

    $this->actingAs($user)
        ->postJson("/api/cras/{$cra->id}/signed-document", [
            'file' => UploadedFile::fake()->image('retour.jpg'),
        ])
        ->assertCreated();
});

test('rejects a file a client would never send back', function (): void {
    $user = User::factory()->create();
    $cra = craDays(
        craOwnedBy($user, null, fn ($factory) => $factory->sent()->forMonth('2026-07')),
        ['2026-07-06' => 10_000],
    );

    $this->actingAs($user)
        ->postJson("/api/cras/{$cra->id}/signed-document", [
            'file' => UploadedFile::fake()->create('notes.csv', 10, 'text/csv'),
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['file']);
});

test('refuses a signed return on a CRA that was never sent', function (): void {
    $user = User::factory()->create();
    $cra = craDays(
        craOwnedBy($user, null, fn ($factory) => $factory->forMonth('2026-07')),
        ['2026-07-06' => 10_000],
    );

    $this->actingAs($user)
        ->postJson("/api/cras/{$cra->id}/signed-document", [
            'file' => UploadedFile::fake()->create('scan.pdf', 90, 'application/pdf'),
        ])
        ->assertStatus(409);
});

test('cannot file a return against another user CRA', function (): void {
    $user = User::factory()->create();
    $cra = craOwnedBy(User::factory()->create(), null, fn ($factory) => $factory->sent());

    $this->actingAs($user)
        ->postJson("/api/cras/{$cra->id}/signed-document", [
            'file' => UploadedFile::fake()->create('scan.pdf', 90, 'application/pdf'),
        ])
        ->assertNotFound();
});

test('returns 401 for guests', function (): void {
    $cra = craOwnedBy(User::factory()->create(), null, fn ($factory) => $factory->sent());

    $this->postJson("/api/cras/{$cra->id}/signed-document", [
        'file' => UploadedFile::fake()->create('scan.pdf', 90, 'application/pdf'),
    ])->assertUnauthorized();
});
