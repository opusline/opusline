<?php

declare(strict_types=1);

namespace App\Domain\Users\Data;

use Spatie\LaravelData\Data;

class RequestPasswordResetData extends Data
{
    public function __construct(
        public string $email,
    ) {}

    /**
     * Lowercase, as registration requires: an address typed with a capital
     * would match no account on a case-sensitive database, and this endpoint
     * could not say so — it answers the same whether or not a link was sent.
     *
     * @return array<string, list<mixed>>
     */
    public static function rules(): array
    {
        return [
            'email' => ['required', 'string', 'lowercase', 'email'],
        ];
    }
}
