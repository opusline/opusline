<?php

declare(strict_types=1);

use App\Domain\Settings\Actions\ReadBackupRecord;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\Storage;

test('requires a signed-in user', function (): void {
    $this->getJson('/api/instance')->assertUnauthorized();
});

test('reports the running version and database', function (): void {
    Storage::fake('instance');

    $this->actingAs(User::factory()->create())
        ->getJson('/api/instance')
        ->assertOk()
        ->assertJsonPath('version', config()->string('app.version'))
        ->assertJsonPath('database', config()->string('database.default'));
});

test('answers no backup when the script has never run', function (): void {
    Storage::fake('instance');

    $this->actingAs(User::factory()->create())
        ->getJson('/api/instance')
        ->assertOk()
        ->assertJsonPath('backup', null);
});

test('reports the backup the script recorded', function (): void {
    Storage::fake('instance');
    Storage::disk('instance')->put(ReadBackupRecord::FILE, json_encode([
        'version' => 1,
        'taken_at' => '2026-09-11T02:00:04Z',
        'archive' => './backups/opusline-20260911-040004.tar.gz',
        'bytes' => 41_234_567,
    ]));

    $this->actingAs(User::factory()->create())
        ->getJson('/api/instance')
        ->assertOk()
        ->assertJsonPath('backup.archive', './backups/opusline-20260911-040004.tar.gz')
        ->assertJsonPath('backup.bytes', 41_234_567)
        ->assertJsonPath('backup.takenAt', '2026-09-11T02:00:04+00:00');
});

test('treats an unreadable record as no record at all', function (string $contents): void {
    Storage::fake('instance');
    Storage::disk('instance')->put(ReadBackupRecord::FILE, $contents);

    $this->actingAs(User::factory()->create())
        ->getJson('/api/instance')
        ->assertOk()
        ->assertJsonPath('backup', null);
})->with([
    'truncated write' => '{"version":1,"taken_at":"2026-09-11T02:0',
    'not an object' => '"backed up"',
    'missing the date' => '{"version":1,"archive":"./backups/a.tar.gz","bytes":12}',
    'a date nothing can parse' => '{"version":1,"taken_at":"soon","archive":"./backups/a.tar.gz","bytes":12}',
    'a size that is not a number' => '{"version":1,"taken_at":"2026-09-11T02:00:04Z","archive":"./backups/a.tar.gz","bytes":"lots"}',
]);
