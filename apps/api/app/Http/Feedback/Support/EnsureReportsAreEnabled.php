<?php

declare(strict_types=1);

namespace App\Http\Feedback\Support;

use App\Domain\Feedback\Reporting\RelayClient;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureReportsAreEnabled
{
    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Switched off by the self-hoster, or with no relay to send to: the
        // route answers as if it were not there, like EnsureMailIsEnabled.
        abort_unless(RelayClient::isConfigured(), 404);

        return $next($request);
    }
}
