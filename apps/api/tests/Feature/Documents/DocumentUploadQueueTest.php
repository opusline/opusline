<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Documents\Jobs\MoveDocumentToMediaDisk;
use App\Domain\Users\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

test('ships the uploaded document to the media disk through the queue', function (): void {
    config(['media-library.disk_name' => 's3']);
    Storage::fake('local');
    Storage::fake('s3');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $documentId = $this->actingAs($user)
        ->post("/api/clients/{$client->slug}/documents", [
            'file' => UploadedFile::fake()->createWithContent('Contrat.pdf', '%PDF-1.4 fake contract'),
        ])
        ->assertCreated()
        ->json('id');

    $document = Media::query()->findOrFail($documentId);

    expect($document->disk)->toBe('s3');
    Storage::disk('s3')->assertExists($document->getPathRelativeToRoot());
    Storage::disk('local')->assertMissing($document->getPathRelativeToRoot());
});

test('serves a document still waiting on the staging disk', function (): void {
    config(['media-library.disk_name' => 's3']);
    Storage::fake('local');
    Storage::fake('s3');
    Queue::fake();
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $documentId = $this->actingAs($user)
        ->post("/api/clients/{$client->slug}/documents", [
            'file' => UploadedFile::fake()->createWithContent('Contrat.pdf', '%PDF-1.4 fake contract'),
        ])
        ->assertCreated()
        ->json('id');

    Queue::assertPushed(MoveDocumentToMediaDisk::class);

    $document = Media::query()->findOrFail($documentId);

    expect($document->disk)->toBe('local');
    $this->actingAs($user)
        ->get("/api/clients/{$client->slug}/documents/{$documentId}/download")
        ->assertOk();
});

test('keeps the document in place when the media disk is the staging disk', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $documentId = $this->actingAs($user)
        ->post("/api/clients/{$client->slug}/documents", [
            'file' => UploadedFile::fake()->createWithContent('Contrat.pdf', '%PDF-1.4 fake contract'),
        ])
        ->assertCreated()
        ->json('id');

    $document = Media::query()->findOrFail($documentId);

    expect($document->disk)->toBe('local');
    Storage::disk('local')->assertExists($document->getPathRelativeToRoot());
});

test('discards its copy when the row was deleted under a running move', function (): void {
    config(['media-library.disk_name' => 's3']);
    Storage::fake('local');
    Storage::fake('s3');
    Queue::fake();
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $documentId = $this->actingAs($user)
        ->post("/api/clients/{$client->slug}/documents", [
            'file' => UploadedFile::fake()->createWithContent('Contrat.pdf', '%PDF-1.4 fake contract'),
        ])
        ->assertCreated()
        ->json('id');
    $document = Media::query()->findOrFail($documentId);
    $path = $document->getPathRelativeToRoot();

    // The row vanishes while the job holds its model — a query delete, so the
    // staged file stays exactly as the job would find it mid-flight.
    Media::query()->whereKey($documentId)->delete();
    new MoveDocumentToMediaDisk($document)->handle();

    Storage::disk('s3')->assertMissing($path);
});
