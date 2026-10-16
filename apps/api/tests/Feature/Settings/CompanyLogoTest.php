<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('uploads the company logo', function (string $fileName): void {
    Storage::fake('local');
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/api/user/logo', ['logo' => UploadedFile::fake()->image($fileName)])
        ->assertNoContent();

    expect($user->getFirstMedia('company_logo')?->file_name)->toBe($fileName);
    $this->actingAs($user)->getJson('/api/settings')->assertJsonPath('hasLogo', true);
})->with(['logo.png', 'logo.jpg']);

test('accepts an svg logo and serves it sandboxed', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $svg = UploadedFile::fake()->createWithContent('logo.svg', '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>');

    $this->actingAs($user)->post('/api/user/logo', ['logo' => $svg])->assertNoContent();

    $this->actingAs($user)
        ->get('/api/user/logo')
        ->assertOk()
        ->assertHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; sandbox");
});

test('replaces the existing logo', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();

    $this->actingAs($user)->post('/api/user/logo', ['logo' => UploadedFile::fake()->image('old.png')]);
    $this->actingAs($user)->post('/api/user/logo', ['logo' => UploadedFile::fake()->image('new.png')]);

    expect($user->getMedia('company_logo'))->toHaveCount(1)
        ->and($user->getFirstMedia('company_logo')?->file_name)->toBe('new.png');
});

test('deletes the logo', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $this->actingAs($user)->post('/api/user/logo', ['logo' => UploadedFile::fake()->image('logo.png')]);

    $this->actingAs($user)->deleteJson('/api/user/logo')->assertNoContent();

    expect($user->getFirstMedia('company_logo'))->toBeNull();
    $this->actingAs($user)->getJson('/api/user/logo')->assertNotFound();
});

test('keeps the logo and the signature apart', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $this->actingAs($user)->post('/api/user/signature', ['signature' => UploadedFile::fake()->image('signature.png')]);
    $this->actingAs($user)->post('/api/user/logo', ['logo' => UploadedFile::fake()->image('logo.png')]);

    $this->actingAs($user)->deleteJson('/api/user/logo');

    expect($user->getFirstMedia('signature'))->not->toBeNull();
    $this->actingAs($user)->getJson('/api/user/documents')->assertJsonCount(0, 'documents');
});

test('rejects a logo that is not an image', function (): void {
    $this->actingAs(User::factory()->create())
        ->post('/api/user/logo', ['logo' => UploadedFile::fake()->create('logo.pdf', 10, 'application/pdf')])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['logo']);
});

test('rejects a logo over 1.5 MB', function (): void {
    $this->actingAs(User::factory()->create())
        ->post('/api/user/logo', ['logo' => UploadedFile::fake()->image('logo.png')->size(1537)])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['logo']);
});

test('serves only the signed-in account its own logo', function (): void {
    Storage::fake('local');
    $owner = User::factory()->create();
    $this->actingAs($owner)->post('/api/user/logo', ['logo' => UploadedFile::fake()->image('logo.png')]);

    $this->actingAs(User::factory()->create())->getJson('/api/user/logo')->assertNotFound();
});

test('uploading a logo leaves another account\'s logo untouched', function (): void {
    Storage::fake('local');
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $this->actingAs($owner)->post('/api/user/logo', ['logo' => UploadedFile::fake()->image('owner.png')]);

    $this->actingAs($other)->post('/api/user/logo', ['logo' => UploadedFile::fake()->image('other.png')])->assertNoContent();

    expect($owner->fresh()?->getMedia('company_logo'))->toHaveCount(1)
        ->and($owner->fresh()?->getFirstMedia('company_logo')?->file_name)->toBe('owner.png');
    $this->actingAs($owner)->get('/api/user/logo')->assertOk();
});

test('deleting a logo leaves another account\'s logo untouched', function (): void {
    Storage::fake('local');
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $this->actingAs($owner)->post('/api/user/logo', ['logo' => UploadedFile::fake()->image('owner.png')]);
    $this->actingAs($other)->post('/api/user/logo', ['logo' => UploadedFile::fake()->image('other.png')]);

    $this->actingAs($other)->deleteJson('/api/user/logo')->assertNoContent();

    expect($owner->fresh()?->getFirstMedia('company_logo')?->file_name)->toBe('owner.png')
        ->and($other->fresh()?->getFirstMedia('company_logo'))->toBeNull();
    $this->actingAs($owner)->get('/api/user/logo')->assertOk();
});
