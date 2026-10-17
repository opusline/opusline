<?php

declare(strict_types=1);

namespace App\Http\AccessTokens\Controllers;

use App\Domain\AccessTokens\Actions\CreateAccessToken;
use App\Domain\AccessTokens\Actions\RevokeAccessToken;
use App\Domain\AccessTokens\Data\AccessTokenData;
use App\Domain\AccessTokens\Data\AccessTokenListData;
use App\Domain\AccessTokens\Data\CreateAccessTokenData;
use App\Domain\AccessTokens\Data\NewAccessTokenData;
use App\Domain\AccessTokens\Models\AccessToken;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class AccessTokenController extends Controller
{
    /** The account's personal access tokens, oldest first. The secrets are not among what it lists. */
    public function index(#[CurrentUser] User $user): JsonResponse
    {
        $tokens = $user->tokens()->oldest('id')->get();

        return response()->json(new AccessTokenListData(
            tokens: array_values(AccessTokenData::collect($tokens, 'array')),
        ));
    }

    /**
     * Creates a personal access token. The answer is the only time the plain
     * text token is shown; it is stored hashed.
     */
    public function store(CreateAccessTokenData $data, #[CurrentUser] User $user, CreateAccessToken $createAccessToken): JsonResponse
    {
        $created = $createAccessToken->handle($user, $data->name, $data->grantedAbilities());
        assert($created->accessToken instanceof AccessToken);

        return response()->json(new NewAccessTokenData(
            token: AccessTokenData::fromModel($created->accessToken),
            plainTextToken: $created->plainTextToken,
        ), 201);
    }

    /** Revokes a token: the application holding it is refused from the next request on. */
    public function destroy(AccessToken $token, #[CurrentUser] User $user, RevokeAccessToken $revokeAccessToken): Response
    {
        $revokeAccessToken->handle($user, $token);

        return response()->noContent();
    }
}
