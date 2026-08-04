<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Users\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('uploads a png logo', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->post("/api/clients/{$client->slug}/logo", ['logo' => UploadedFile::fake()->image('logo.png')])
        ->assertNoContent();

    $logo = $client->getFirstMedia('logo');

    expect($logo)->not->toBeNull()
        ->and($logo?->file_name)->toBe('logo.png');
    Storage::disk('local')->assertExists($logo->getPathRelativeToRoot());
});

test('replaces the existing logo', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->post("/api/clients/{$client->slug}/logo", ['logo' => UploadedFile::fake()->image('old.png')])
        ->assertNoContent();
    $this->actingAs($user)
        ->post("/api/clients/{$client->slug}/logo", ['logo' => UploadedFile::fake()->image('new.png')])
        ->assertNoContent();

    expect($client->getMedia('logo'))->toHaveCount(1)
        ->and($client->getFirstMedia('logo')?->file_name)->toBe('new.png');
});

test('serves the logo inline with a restrictive csp', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $this->actingAs($user)
        ->post("/api/clients/{$client->slug}/logo", ['logo' => UploadedFile::fake()->image('logo.png')]);

    $response = $this->actingAs($user)
        ->get("/api/clients/{$client->slug}/logo")
        ->assertOk()
        ->assertHeader('Content-Security-Policy', "default-src 'none'");

    expect($response->headers->get('Cache-Control'))->toContain('no-store');
});

test('returns 404 when the client has no logo', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->getJson("/api/clients/{$client->slug}/logo")
        ->assertNotFound();
});

test('deletes the logo', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $this->actingAs($user)
        ->post("/api/clients/{$client->slug}/logo", ['logo' => UploadedFile::fake()->image('logo.png')]);

    $this->actingAs($user)
        ->deleteJson("/api/clients/{$client->slug}/logo")
        ->assertNoContent();

    expect($client->getFirstMedia('logo'))->toBeNull();
});

test('rejects a non image logo', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->post("/api/clients/{$client->slug}/logo", [
            'logo' => UploadedFile::fake()->create('logo.pdf', 10, 'application/pdf'),
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['logo']);
});

test('rejects an oversized logo', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->post("/api/clients/{$client->slug}/logo", [
            'logo' => UploadedFile::fake()->create('logo.png', 3_000, 'image/png'),
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['logo']);
});

test('cannot upload a logo to another user client', function (): void {
    $client = Client::factory()->create();

    $this->actingAs(User::factory()->create())
        ->post("/api/clients/{$client->slug}/logo", ['logo' => UploadedFile::fake()->image('logo.png')])
        ->assertNotFound();
});

test('cannot view the logo of another user client', function (): void {
    Storage::fake('local');
    $owner = User::factory()->create();
    $client = Client::factory()->for($owner)->create();
    $this->actingAs($owner)
        ->post("/api/clients/{$client->slug}/logo", ['logo' => UploadedFile::fake()->image('logo.png')]);

    $this->actingAs(User::factory()->create())
        ->getJson("/api/clients/{$client->slug}/logo")
        ->assertNotFound();
});

test('cannot delete the logo of another user client', function (): void {
    Storage::fake('local');
    $owner = User::factory()->create();
    $client = Client::factory()->for($owner)->create();
    $this->actingAs($owner)
        ->post("/api/clients/{$client->slug}/logo", ['logo' => UploadedFile::fake()->image('logo.png')]);

    $this->actingAs(User::factory()->create())
        ->deleteJson("/api/clients/{$client->slug}/logo")
        ->assertNotFound();

    expect($client->getFirstMedia('logo'))->not->toBeNull();
});

test('returns 401 for guests', function (): void {
    $client = Client::factory()->create();

    $this->post("/api/clients/{$client->slug}/logo", ['logo' => UploadedFile::fake()->image('logo.png')])
        ->assertUnauthorized();
});
