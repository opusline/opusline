<?php

declare(strict_types=1);

namespace App\Domain\Clients\Factories;

use App\Domain\Clients\Enums\ClientType;
use App\Domain\Clients\Models\Client;
use App\Domain\Shared\Enums\Color;
use App\Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Client>
 */
class ClientFactory extends Factory
{
    protected $model = Client::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->unique()->company(),
            'type' => ClientType::Direct,
            'notes' => null,
            'siret' => null,
            'vat_number' => null,
            'billing_address_line1' => null,
            'billing_address_line2' => null,
            'billing_postal_code' => null,
            'billing_city' => null,
            'billing_country' => null,
            'billing_contact_name' => null,
            'billing_email' => null,
            'color' => Color::Amber,
            'payment_terms_days' => 45,
            'archived_at' => null,
        ];
    }

    /**
     * Indicate that the client is an intermediary (ESN) billing an end client.
     */
    public function intermediary(): static
    {
        return $this->state(fn (array $attributes): array => [
            'type' => ClientType::Intermediary,
        ]);
    }

    /**
     * Indicate that the client is an internal/personal, non-billable one.
     */
    public function internal(): static
    {
        return $this->state(fn (array $attributes): array => [
            'type' => ClientType::Internal,
        ]);
    }

    /**
     * Indicate that the client is archived.
     */
    public function archived(): static
    {
        return $this->state(fn (array $attributes): array => [
            'archived_at' => now(),
        ]);
    }
}
