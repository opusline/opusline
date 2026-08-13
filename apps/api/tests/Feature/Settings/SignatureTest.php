<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('uploads a signature', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/api/user/signature', ['signature' => UploadedFile::fake()->image('signature.png')])
        ->assertNoContent();

    $signature = $user->getFirstMedia('signature');

    expect($signature)->not->toBeNull()
        ->and($signature?->file_name)->toBe('signature.png');
    Storage::disk('local')->assertExists($signature->getPathRelativeToRoot());
});

test('replaces the existing signature', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/api/user/signature', ['signature' => UploadedFile::fake()->image('old.png')]);
    $this->actingAs($user)
        ->post('/api/user/signature', ['signature' => UploadedFile::fake()->image('new.png')])
        ->assertNoContent();

    expect($user->getMedia('signature'))->toHaveCount(1)
        ->and($user->getFirstMedia('signature')?->file_name)->toBe('new.png');
});

test('serves the signature with a restrictive csp', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $this->actingAs($user)
        ->post('/api/user/signature', ['signature' => UploadedFile::fake()->image('signature.png')]);

    $response = $this->actingAs($user)
        ->get('/api/user/signature')
        ->assertOk()
        ->assertHeader('Content-Security-Policy', "default-src 'none'");

    expect($response->headers->get('Cache-Control'))->toContain('no-store');
});

test('returns 404 when no signature is stored', function (): void {
    $this->actingAs(User::factory()->create())
        ->getJson('/api/user/signature')
        ->assertNotFound();
});

test('deletes the signature', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $this->actingAs($user)
        ->post('/api/user/signature', ['signature' => UploadedFile::fake()->image('signature.png')]);

    $this->actingAs($user)
        ->deleteJson('/api/user/signature')
        ->assertNoContent();

    expect($user->getFirstMedia('signature'))->toBeNull();
});

test('rejects a non png signature', function (): void {
    $this->actingAs(User::factory()->create())
        ->post('/api/user/signature', [
            'signature' => UploadedFile::fake()->create('signature.pdf', 10, 'application/pdf'),
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['signature']);
});

test('rejects an oversized signature', function (): void {
    $this->actingAs(User::factory()->create())
        ->post('/api/user/signature', [
            'signature' => UploadedFile::fake()->create('signature.png', 2_000, 'image/png'),
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['signature']);
});

test('never serves another account signature', function (): void {
    Storage::fake('local');
    $owner = User::factory()->create();
    $this->actingAs($owner)
        ->post('/api/user/signature', ['signature' => UploadedFile::fake()->image('signature.png')]);

    $this->actingAs(User::factory()->create())
        ->getJson('/api/user/signature')
        ->assertNotFound();

    expect($owner->getFirstMedia('signature'))->not->toBeNull();
});

test('returns 401 for guests', function (): void {
    $this->post('/api/user/signature', ['signature' => UploadedFile::fake()->image('signature.png')])
        ->assertUnauthorized();
});
