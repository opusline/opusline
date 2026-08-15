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

        return $request->getPreferredLanguage(Locale::languageTags())
            ?? config()->string('app.locale');
    }
}
