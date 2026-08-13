<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;

test('renders a draft on the fly, so the preview follows the grid', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user);
    $cra = craDays(
        craOwnedBy($user, $mission, fn ($factory) => $factory->forMonth('2026-07')),
        ['2026-07-06' => 10_000],
    );

    $response = $this->actingAs($user)->get("/api/cras/{$cra->id}/pdf")->assertOk();

    expect($response->headers->get('content-type'))->toContain('application/pdf')
        ->and($response->headers->get('content-disposition'))->toContain("CRA-{$mission->slug}-2026-07.pdf")
        // A draft renders inline rather than streaming a stored file, so the body is
        // on the response itself.
        ->and($response->getContent())->toStartWith('%PDF-');
});

test('follows an edit made after the first preview', function (): void {
    $user = User::factory()->create();
    $cra = craDays(
        craOwnedBy($user, null, fn ($factory) => $factory->forMonth('2026-07')),
        ['2026-07-06' => 10_000],
    );

    $before = $this->actingAs($user)->get("/api/cras/{$cra->id}/pdf")->getContent();

    $this->actingAs($user)
        ->putJson("/api/cras/{$cra->id}/days", ['days' => [
            ['date' => '2026-07-06', 'dayFractionBp' => 10_000],
            ['date' => '2026-07-07', 'dayFractionBp' => 10_000],
            ['date' => '2026-07-08', 'dayFractionBp' => 10_000],
        ]])
        ->assertOk();

    $after = $this->actingAs($user)->get("/api/cras/{$cra->id}/pdf")->getContent();

    expect($after)->not->toBe($before);
});

test('streams the document the client received once it has been sent', function (): void {
    $user = User::factory()->create();
    $cra = craDays(
        craOwnedBy($user, null, fn ($factory) => $factory->forMonth('2026-07')),
        ['2026-07-06' => 10_000],
    );

    $this->actingAs($user)->postJson("/api/cras/{$cra->id}/send")->assertOk();
    $sent = $this->actingAs($user)->get("/api/cras/{$cra->id}/pdf")->assertOk()->streamedContent();

    // The stored file is served verbatim, so a later change of scenery cannot rewrite
    // history: the download stays the document that was handed over.
    $user->settings()->sole()->update(['trade_name' => 'Une toute autre raison sociale']);

    expect($this->actingAs($user)->get("/api/cras/{$cra->id}/pdf")->streamedContent())->toBe($sent);
});

test('streams each month its own document when a mission has sent several', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user);
    $june = craDays(
        craOwnedBy($user, $mission, fn ($factory) => $factory->forMonth('2026-06')),
        ['2026-06-01' => 10_000],
    );
    $july = craDays(
        craOwnedBy($user, $mission, fn ($factory) => $factory->forMonth('2026-07')),
        ['2026-07-06' => 10_000, '2026-07-07' => 10_000],
    );

    $this->actingAs($user)->postJson("/api/cras/{$june->id}/send")->assertOk();
    $this->actingAs($user)->postJson("/api/cras/{$july->id}/send")->assertOk();

    // Both documents hang off the same mission, so a lookup that only filters on the
    // category hands June's download whichever was filed last.
    $downloaded = $this->actingAs($user)->get("/api/cras/{$june->id}/pdf")->assertOk();

    expect($downloaded->headers->get('content-disposition'))
        ->toContain("CRA-{$mission->slug}-2026-06.pdf");
});

test('accepts the spellings a query string can carry for the signature flag', function (string $given): void {
    $user = User::factory()->create();
    $cra = craDays(
        craOwnedBy($user, null, fn ($factory) => $factory->forMonth('2026-07')),
        ['2026-07-06' => 10_000],
    );

    $this->actingAs($user)
        ->get("/api/cras/{$cra->id}/pdf?applySignature={$given}")
        ->assertOk();
})->with(['true', 'false', '1', '0']);

test('still refuses a signature flag that means nothing', function (): void {
    $user = User::factory()->create();
    $cra = craOwnedBy($user, null, fn ($factory) => $factory->forMonth('2026-07'));

    $this->actingAs($user)
        ->getJson("/api/cras/{$cra->id}/pdf?applySignature=banana")
        ->assertStatus(422);
});

test('cannot download another user CRA', function (): void {
    $user = User::factory()->create();
    $cra = craOwnedBy(User::factory()->create());

    $this->actingAs($user)->get("/api/cras/{$cra->id}/pdf")->assertNotFound();
});

test('returns 401 for guests', function (): void {
    $cra = craOwnedBy(User::factory()->create());

    $this->get("/api/cras/{$cra->id}/pdf")->assertUnauthorized();
});
