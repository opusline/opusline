<?php

declare(strict_types=1);

namespace App\Domain\Users\Data;

use Illuminate\Validation\Rules\Password;
use Spatie\LaravelData\Data;

class UpdateUserPasswordData extends Data
{
    public function __construct(
        public string $password,
    ) {}

    /**
     * The same rules as registration: a password chosen later is held to the
     * bar the first one was.
     *
     * @return array<string, list<mixed>>
     */
    public static function rules(): array
    {
        return [
            'password' => ['required', 'string', 'min:8', 'max:255', Password::defaults(), 'confirmed'],
        ];
    }
}
