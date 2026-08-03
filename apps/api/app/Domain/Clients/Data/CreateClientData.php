<?php

declare(strict_types=1);

namespace App\Domain\Clients\Data;

use Illuminate\Validation\Rule;
use Spatie\LaravelData\Data;

class CreateClientData extends Data
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
            'name' => [
                'required',
                'string',
                'min:1',
                'max:255',
                Rule::unique('clients', 'name')->where('user_id', auth()->id()),
            ],
            'notes' => ['nullable', 'string'],
        ];
    }
}
