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
        public bool $vatLiable,
        public int $effectiveVatRateBp,
        public string $timezone,
        public int $workdayMinutes,
        /**
         * The account's own URSSAF rate, versement libératoire included — what the
         * mission projection has to price a provision with. An ACRE account pays
         * roughly 15 % less than the national default, so a constant in the browser
         * is wrong for exactly the people the projection matters most to.
         */
        public int $effectiveContributionRateBp,
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
            vatLiable: $settings->vat_regime->isLiable(),
            effectiveVatRateBp: $settings->effectiveVatRateBp(),
            timezone: $settings->timezone,
            workdayMinutes: $settings->workday_minutes,
            effectiveContributionRateBp: $settings->effectiveContributionRateBp(),
        );
    }
}
