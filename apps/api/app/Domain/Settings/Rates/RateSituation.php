<?php

declare(strict_types=1);

namespace App\Domain\Settings\Rates;

use App\Domain\Settings\Models\UserSettings;
use Carbon\CarbonImmutable;

class RateSituation
{
    private const string LEGAL_FORM = "'EI'";

    private const string ACTIVITY = "'libérale'";

    private const string UNKNOWN_CREATION_DATE = '2000-01-01';

    public function __construct(
        private readonly bool $acre,
        private readonly ?CarbonImmutable $businessStartedOn,
    ) {}

    public static function fromSettings(UserSettings $settings): self
    {
        return new self(
            acre: $settings->acre,
            businessStartedOn: $settings->business_started_on,
        );
    }

    /**
     * @return array<string, string>
     */
    public function toArray(): array
    {
        return [
            'entreprise . catégorie juridique' => self::LEGAL_FORM,
            'entreprise . catégorie juridique . EI . auto-entrepreneur' => 'oui',
            'entreprise . activité . nature' => self::ACTIVITY,
            'entreprise . activité . nature . libérale . réglementée' => 'non',
            'établissement . commune . département . outre-mer' => 'non',
            'entreprise . date de création' => $this->createdOn()->format('d/m/Y'),
            'dirigeant . exonérations . ACRE' => $this->acre ? 'oui' : 'non',
        ];
    }

    public function signature(): string
    {
        return md5(serialize($this->toArray()));
    }

    private function createdOn(): CarbonImmutable
    {
        return $this->businessStartedOn ?? CarbonImmutable::parse(self::UNKNOWN_CREATION_DATE);
    }
}
