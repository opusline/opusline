<?php

declare(strict_types=1);

namespace App\Http\Users\Support;

use App\Domain\Users\Models\User;
use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;
use Symfony\Component\HttpFoundation\Response;

/**
 * Everything a personal access token is not for. The routes that honour a
 * token say so with Sanctum's abilities middleware; every other route group
 * opens with this one, so a token reaching it is refused whatever abilities
 * it carries. A cookie session, which Sanctum represents as a transient
 * token, passes.
 */
class RefuseAccessTokens
{
    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        abort_if(self::isTokenRequest($request), 403, __('tokens.not_for_tokens'));

        return $next($request);
    }

    public static function isTokenRequest(Request $request): bool
    {
        $user = $request->user();

        return $user instanceof User && $user->currentAccessToken() instanceof PersonalAccessToken;
    }
}
