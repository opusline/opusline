<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Factories;

use App\Domain\Invoices\Enums\EmailTemplateKind;
use App\Domain\Invoices\Models\DocumentEmail;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DocumentEmail>
 */
class DocumentEmailFactory extends Factory
{
    #[\Override]
    protected $model = DocumentEmail::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'invoice_id' => null,
            'quote_id' => null,
            'kind' => EmailTemplateKind::NewInvoice,
            'recipients' => ['compta@nordlys.test'],
            'copy_to_sender' => false,
            'subject' => 'Facture F-2026-014 (Refonte du site)',
            'body' => "Bonjour Sophie,\n\nVoici la facture F-2026-014.\n\nBonne journée,",
            'sent_at' => CarbonImmutable::now(),
        ];
    }
}
