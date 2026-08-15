<?php

declare(strict_types=1);

namespace App\Http\Support;

use App\Domain\Settings\Enums\Locale;
use App\Domain\Users\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        app()->setLocale($this->resolve($request));

        return $next($request);
    }

    private function resolve(Request $request): string
    {
        $user = $request->user('sanctum');

        if ($user instanceof User) {
            return $user->loadMissing('settings')->settingsOrFail()->locale->languageTag();
        }

        // getPreferredLanguage() falls back to the first candidate, so the
        // configured default must lead the list — enum case order must not
        // decide the guest default.
        $default = Locale::fromLanguageTag(config()->string('app.locale'))->languageTag();
        $candidates = array_values(array_unique([$default, ...Locale::languageTags()]));

        return $request->getPreferredLanguage($candidates) ?? $default;
    }
}
