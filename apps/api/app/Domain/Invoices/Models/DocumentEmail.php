<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Models;

use App\Domain\Invoices\Enums\EmailTemplateKind;
use App\Domain\Invoices\Factories\DocumentEmailFactory;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One e-mail sent to a client about an invoice or a quote, kept as it left.
 *
 * @property int $id
 * @property int $user_id
 * @property ?int $invoice_id
 * @property ?int $quote_id
 * @property EmailTemplateKind $kind
 * @property list<string> $recipients
 * @property bool $copy_to_sender
 * @property string $subject
 * @property string $body
 * @property CarbonImmutable $sent_at
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property-read User $user
 * @property-read ?Invoice $invoice
 * @property-read ?Quote $quote
 */
#[Fillable(['user_id', 'invoice_id', 'quote_id', 'kind', 'recipients', 'copy_to_sender', 'subject', 'body', 'sent_at'])]
class DocumentEmail extends Model
{
    /** @use HasFactory<DocumentEmailFactory> */
    use HasFactory;

    protected static function newFactory(): DocumentEmailFactory
    {
        return DocumentEmailFactory::new();
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<Invoice, $this> */
    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    /** @return BelongsTo<Quote, $this> */
    public function quote(): BelongsTo
    {
        return $this->belongsTo(Quote::class);
    }

    /**
     * @return array<string, string>
     */
    #[\Override]
    protected function casts(): array
    {
        return [
            'kind' => EmailTemplateKind::class,
            'recipients' => 'array',
            'copy_to_sender' => 'boolean',
            'sent_at' => 'immutable_datetime',
        ];
    }
}
