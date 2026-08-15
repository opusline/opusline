<?php

declare(strict_types=1);

namespace App\Domain\Settings\Enums;

enum Locale: string
{
    case fr_FR = 'fr-FR';
    case en_US = 'en-US';

    public static function fromLanguageTag(string $tag): self
    {
        foreach (self::cases() as $case) {
            if ($case->languageTag() === $tag) {
                return $case;
            }
        }

        return self::fr_FR;
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
            self::fr_FR => 'fr',
            self::en_US => 'en',
        };
    }
}
