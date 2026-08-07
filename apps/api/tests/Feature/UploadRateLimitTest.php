<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Users\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('stops a user who floods the logo upload route', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    for ($attempt = 0; $attempt < 20; $attempt++) {
        $this->actingAs($user)
            ->post("/api/clients/{$client->slug}/logo", [
                'logo' => UploadedFile::fake()->image('logo.png'),
            ])
            ->assertNoContent();
    }

    $this->actingAs($user)
        ->post("/api/clients/{$client->slug}/logo", [
            'logo' => UploadedFile::fake()->image('logo.png'),
        ])
        ->assertStatus(429);
});

test('spends the upload quota per user rather than globally', function (): void {
    Storage::fake('local');
    $flooder = User::factory()->create();
    $flooderClient = Client::factory()->for($flooder)->create();

    for ($attempt = 0; $attempt < 20; $attempt++) {
        $this->actingAs($flooder)
            ->post("/api/clients/{$flooderClient->slug}/logo", [
                'logo' => UploadedFile::fake()->image('logo.png'),
            ]);
    }

    $bystander = User::factory()->create();
    $bystanderClient = Client::factory()->for($bystander)->create();

    $this->actingAs($bystander)
        ->post("/api/clients/{$bystanderClient->slug}/logo", [
            'logo' => UploadedFile::fake()->image('logo.png'),
        ])
        ->assertNoContent();
});
