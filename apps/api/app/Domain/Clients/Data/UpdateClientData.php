<?php

declare(strict_types=1);

namespace App\Domain\Clients\Data;

use App\Domain\Clients\Models\Client;
use Illuminate\Validation\Rule;
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
        $routeClient = request()->route('client');
        $clientId = $routeClient instanceof Client ? $routeClient->id : null;

        return [
            'name' => [
                'required',
                'string',
                'min:1',
                'max:255',
                Rule::unique('clients', 'name')
                    ->where('user_id', auth()->id())
                    ->ignore($clientId),
            ],
            'notes' => ['nullable', 'string'],
        ];
    }
}
