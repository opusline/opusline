<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Models;

use App\Domain\Invoices\Enums\EmailTemplateKind;
use App\Domain\Invoices\Factories\EmailTemplateFactory;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * The account's own wording of one client e-mail. No row means the built-in
 * default: resetting a template is deleting its row.
 *
 * @property int $id
 * @property int $user_id
 * @property EmailTemplateKind $kind
 * @property string $subject
 * @property string $body
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property-read User $user
 */
#[Fillable(['kind', 'subject', 'body'])]
class EmailTemplate extends Model
{
    /** @use HasFactory<EmailTemplateFactory> */
    use HasFactory;

    protected static function newFactory(): EmailTemplateFactory
    {
        return EmailTemplateFactory::new();
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return array<string, string>
     */
    #[\Override]
    protected function casts(): array
    {
        return [
            'kind' => EmailTemplateKind::class,
        ];
    }
}
