<?php

declare(strict_types=1);

namespace App\Http\Feedback\Support;

use App\Domain\Feedback\Relay\GitHubApp;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/** An instance that is not the relay answers as if the relay routes did not exist. */
class EnsureRelayIsEnabled
{
    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        abort_unless(GitHubApp::isConfigured(), 404);

        return $next($request);
    }
}
