<?php

declare(strict_types=1);

namespace App\Domain\EInvoicing\Factories;

use App\Domain\EInvoicing\Enums\EInvoicingPlatformKind;
use App\Domain\EInvoicing\Enums\PlatformEnvironment;
use App\Domain\EInvoicing\Models\EInvoicingConnection;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EInvoicingConnection>
 */
class EInvoicingConnectionFactory extends Factory
{
    #[\Override]
    protected $model = EInvoicingConnection::class;

    /**
     * A verified sandbox company on Super PDP, registered in the annuaire.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'platform' => EInvoicingPlatformKind::SuperPdp,
            'client_id' => 'opusline_'.fake()->regexify('[a-z0-9]{16}'),
            'client_secret' => 'secret_'.fake()->regexify('[a-z0-9]{32}'),
            'company_name' => 'Théo Marchand',
            'company_number' => '123456782',
            'environment' => PlatformEnvironment::Sandbox,
            'company_verified' => true,
            'receiving_address' => '0225:12345678200002',
            'checked_at' => CarbonImmutable::now(),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (): array => ['company_verified' => false, 'receiving_address' => null]);
    }

    public function production(): static
    {
        return $this->state(fn (): array => ['environment' => PlatformEnvironment::Production]);
    }
}
