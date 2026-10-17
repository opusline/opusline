<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Factories;

use App\Domain\Invoices\Enums\EmailTemplateKind;
use App\Domain\Invoices\Models\EmailTemplate;
use App\Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EmailTemplate>
 */
class EmailTemplateFactory extends Factory
{
    #[\Override]
    protected $model = EmailTemplate::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'kind' => EmailTemplateKind::NewInvoice,
            'subject' => 'Facture {numero} · {titre}',
            'body' => "Bonjour {client},\n\nVoici la facture {numero} de {montant}, à régler avant le {echeance}.\n\n{contact}",
        ];
    }
}
