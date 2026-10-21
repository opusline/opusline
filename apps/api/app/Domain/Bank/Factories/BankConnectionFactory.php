<?php

declare(strict_types=1);

namespace App\Domain\Bank\Factories;

use App\Domain\Bank\Enums\BankConnectionStatus;
use App\Domain\Bank\Models\BankAccount;
use App\Domain\Bank\Models\BankConnection;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<BankConnection>
 */
class BankConnectionFactory extends Factory
{
    #[\Override]
    protected $model = BankConnection::class;

    /**
     * An active connection to a fictional bank, one euro account attached.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $uid = (string) Str::uuid();
        $identificationHash = 'hash-'.Str::random(12);

        return [
            'user_id' => User::factory(),
            'aspsp_name' => 'Banque Orvella',
            'status' => BankConnectionStatus::Active,
            'session_id' => (string) Str::uuid(),
            'accounts' => [[
                'uid' => $uid,
                'identificationHash' => $identificationHash,
                'name' => 'Compte pro',
                'ibanLast4' => '0185',
                'currency' => 'EUR',
            ]],
            'account_uid' => $uid,
            'account_identification_hash' => $identificationHash,
            'valid_until' => CarbonImmutable::now()->addDays(150),
            'bank_account_id' => fn (array $attributes): ?int => is_string($attributes['account_identification_hash'] ?? null)
                ? $this->accountFor($attributes['user_id'], $attributes['account_identification_hash'])
                : null,
        ];
    }

    /**
     * The user's first account when nothing syncs it yet, so statements a
     * test creates before or after land in the account the connection
     * feeds; a fresh account otherwise.
     */
    private function accountFor(mixed $userId, string $identificationHash): int
    {
        $account = BankAccount::query()->where('user_id', $userId)->whereDoesntHave('connection')->orderBy('id')->first()
            ?? BankAccount::factory()->make(['user_id' => $userId]);
        $account->identification_hash = $identificationHash;
        $account->save();

        return $account->id;
    }
}
