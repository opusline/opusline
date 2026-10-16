<?php

declare(strict_types=1);

namespace App\Domain\EInvoicing\Models;

use App\Domain\EInvoicing\Enums\EInvoicingPlatformKind;
use App\Domain\EInvoicing\Enums\PlatformEnvironment;
use App\Domain\EInvoicing\Factories\EInvoicingConnectionFactory;
use App\Domain\EInvoicing\Platform\ConnectionCheck;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * The account's own credentials on its plateforme agréée, and what the
 * platform last said about the company behind them.
 *
 * @property int $id
 * @property int $user_id
 * @property EInvoicingPlatformKind $platform
 * @property string $client_id
 * @property string $client_secret
 * @property ?string $company_name
 * @property ?string $company_number
 * @property ?PlatformEnvironment $environment
 * @property bool $company_verified
 * @property ?string $receiving_address
 * @property ?CarbonImmutable $checked_at
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property-read User $user
 */
#[Fillable(['platform', 'client_id', 'client_secret', 'company_name', 'company_number', 'environment', 'company_verified', 'receiving_address', 'checked_at'])]
#[Hidden(['client_secret'])]
#[Table(name: 'e_invoicing_connections')]
class EInvoicingConnection extends Model
{
    /** @use HasFactory<EInvoicingConnectionFactory> */
    use HasFactory;

    protected static function newFactory(): EInvoicingConnectionFactory
    {
        return EInvoicingConnectionFactory::new();
    }

    /**
     * @return array<string, string>
     */
    #[\Override]
    protected function casts(): array
    {
        return [
            'platform' => EInvoicingPlatformKind::class,
            'client_secret' => 'encrypted',
            'environment' => PlatformEnvironment::class,
            'company_verified' => 'boolean',
            'checked_at' => 'datetime',
        ];
    }

    /** What the platform just said about the company, dated now. */
    public function recordCheck(ConnectionCheck $check): static
    {
        return $this->fill([
            'company_name' => $check->companyName,
            'company_number' => $check->companyNumber,
            'environment' => $check->environment,
            'company_verified' => $check->companyVerified,
            'receiving_address' => $check->receivingAddress,
            'checked_at' => CarbonImmutable::now(),
        ]);
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
