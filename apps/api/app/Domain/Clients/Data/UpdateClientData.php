<?php

declare(strict_types=1);

namespace App\Domain\Clients\Data;

use Spatie\LaravelData\Data;

class UpdateClientData extends Data
{
    public function __construct(
        public string $name,
        public ?string $notes = null,
    ) {}

    /**
     * @return array<string, list<mixed>>
     */
    public static function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:1', 'max:255'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
