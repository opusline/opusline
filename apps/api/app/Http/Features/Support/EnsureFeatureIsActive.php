<?php

declare(strict_types=1);

namespace App\Http\Features\Support;

use App\Domain\Features\Enums\FeatureFlag;
use App\Domain\Features\FeatureFlags;
use App\Domain\Users\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureFeatureIsActive
{
    public function __construct(private readonly FeatureFlags $flags) {}

    /**
     * Use as `EnsureFeatureIsActive::class.':invoicing'`. A route behind a flag the
     * account does not have answers as if it were not there, like EnsureMailIsEnabled.
     *
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next, string $key): Response
    {
        $flag = FeatureFlag::fromKey($key);
        $user = $request->user();

        abort_if(! $flag instanceof FeatureFlag || ! $user instanceof User || ! $this->flags->isActive($user, $flag), 404);

        return $next($request);
    }
}
