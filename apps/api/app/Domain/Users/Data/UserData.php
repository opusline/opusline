<?php

declare(strict_types=1);

namespace App\Domain\Users\Data;

use App\Domain\Settings\Enums\DateFormat;
use App\Domain\Settings\Enums\Locale;
use App\Domain\Shared\Enums\Currency;
use App\Domain\Users\Enums\Theme;
use App\Domain\Users\Models\User;
use Spatie\LaravelData\Data;

class UserData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $email,
        public Theme $theme,
        public ?string $releaseNotesSeenVersion,
        public Locale $locale,
        public DateFormat $dateFormat,
        public Currency $currency,
        public string $businessCountry,
        public bool $hasFrenchFiscality,
        public string $timezone,
        public int $workdayMinutes,
    ) {}

    public static function fromModel(User $user): self
    {
        $settings = $user->settingsOrFail();

        return new self(
            id: $user->id,
            name: $user->name,
            email: $user->email,
            theme: $user->theme,
            releaseNotesSeenVersion: $user->release_notes_seen_version,
            locale: $settings->locale,
            dateFormat: $settings->date_format,
            currency: $settings->currency,
            businessCountry: $settings->business_country,
            hasFrenchFiscality: $settings->hasFrenchFiscality(),
            timezone: $settings->timezone,
            workdayMinutes: $settings->workday_minutes,
        );
    }
}
