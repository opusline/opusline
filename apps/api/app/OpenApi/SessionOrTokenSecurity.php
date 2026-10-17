<?php

declare(strict_types=1);

namespace App\OpenApi;

use Dedoc\Scramble\Configuration\OperationTransformers;
use Dedoc\Scramble\Configuration\SecurityDocumentationContext;
use Dedoc\Scramble\Contracts\SecurityDocumentationStrategy;
use Dedoc\Scramble\GeneratorConfig;
use Dedoc\Scramble\Support\Generator\OpenApi;
use Dedoc\Scramble\Support\Generator\Operation;
use Dedoc\Scramble\Support\Generator\SecurityRequirement;
use Dedoc\Scramble\Support\Generator\SecuritySchemes\ApiKeySecurityScheme;
use Dedoc\Scramble\Support\Generator\SecuritySchemes\HttpSecurityScheme;
use Dedoc\Scramble\Support\RouteInfo;
use Illuminate\Support\Str;
use Laravel\Sanctum\Http\Middleware\CheckAbilities;

/**
 * Two ways in, documented as such. Every authenticated operation takes the
 * SPA's session cookie; the ones behind Sanctum's abilities middleware — the
 * invoice reads — also take a personal access token as a bearer, and list it.
 */
class SessionOrTokenSecurity implements SecurityDocumentationStrategy
{
    private const string SESSION = 'session';

    private const string BEARER = 'bearer';

    public function configure(SecurityDocumentationContext $context): GeneratorConfig
    {
        $session = new ApiKeySecurityScheme('cookie', 'opusline-session')
            ->as(self::SESSION)
            ->setDescription('The session cookie POST /api/login sets. Every operation takes it.');
        $bearer = new HttpSecurityScheme('bearer')
            ->as(self::BEARER)
            ->setDescription('A personal access token, created in Settings › Security and sent as `Authorization: Bearer <token>`. Only the operations that list this scheme take one, within the abilities the token carries (`invoices:read`).');

        return $context->config
            ->withDocumentTransformers(function (OpenApi $openApi) use ($session, $bearer): void {
                $openApi->secure($session);
                $openApi->components->addSecurityScheme(self::BEARER, $bearer);
            })
            ->withOperationTransformers(function (OperationTransformers $transformers): void {
                $transformers->prepend(function (Operation $operation, RouteInfo $routeInfo): void {
                    /** @var list<string> $middleware */
                    $middleware = $routeInfo->route->gatherMiddleware();

                    if (! $this->isAuthenticated($middleware)) {
                        $operation->security = [];

                        return;
                    }

                    if ($this->takesTokens($middleware)) {
                        $operation->security = [
                            new SecurityRequirement([self::SESSION => []]),
                            new SecurityRequirement([self::BEARER => []]),
                        ];
                    }
                });
            });
    }

    /** @param list<string> $middleware */
    private function isAuthenticated(array $middleware): bool
    {
        return array_any($middleware, fn (string $name): bool => Str::is(['auth', 'auth:*'], $name));
    }

    /** @param list<string> $middleware */
    private function takesTokens(array $middleware): bool
    {
        return array_any($middleware, fn (string $name): bool => str_starts_with($name, CheckAbilities::class.':'));
    }
}
