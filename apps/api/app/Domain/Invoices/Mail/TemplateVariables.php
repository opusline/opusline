<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Mail;

use App\Domain\Invoices\Enums\EmailTemplateKind;

/** The `{name}` placeholders of a template: what they are, and what they become. */
final class TemplateVariables
{
    /**
     * @param  array<string, string>  $values
     */
    public static function fill(string $text, array $values): string
    {
        $replacements = [];

        foreach ($values as $name => $value) {
            $replacements['{'.$name.'}'] = $value;
        }

        return strtr($text, $replacements);
    }

    /**
     * The placeholders the text uses that this kind of e-mail does not know.
     *
     * @return list<string>
     */
    public static function unknown(string $text, EmailTemplateKind $kind): array
    {
        preg_match_all('/\{([a-z_]+)\}/', $text, $matches);

        return array_values(array_unique(array_diff($matches[1], $kind->variables())));
    }
}
