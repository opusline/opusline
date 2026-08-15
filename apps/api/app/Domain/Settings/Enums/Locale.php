<?php

declare(strict_types=1);

namespace App\Domain\Settings\Enums;

enum Locale: string
{
    case en_US = 'en-US';
    case fr_FR = 'fr-FR';

    public static function fromLanguageTag(string $tag): self
    {
        foreach (self::cases() as $case) {
            if ($case->languageTag() === $tag) {
                return $case;
            }
        }

        return self::en_US;
    }

    /**
     * @return non-empty-list<string>
     */
    public static function languageTags(): array
    {
        return array_map(fn (self $case): string => $case->languageTag(), self::cases());
    }

    public function languageTag(): string
    {
        return match ($this) {
            self::en_US => 'en',
            self::fr_FR => 'fr',
        };
    }
}
