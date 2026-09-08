<?php

declare(strict_types=1);

namespace App\Http\TwoFactor\Controllers;

use App\Domain\TwoFactor\Actions\RevokeAllTrustedDevices;
use App\Domain\TwoFactor\Actions\RevokeTrustedDevice;
use App\Domain\TwoFactor\Models\TrustedDevice;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use App\Http\TwoFactor\Support\TrustedDeviceCookie;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TrustedDeviceController extends Controller
{
    public function destroy(TrustedDevice $trustedDevice, Request $request, RevokeTrustedDevice $revokeTrustedDevice): Response
    {
        $revokedTokenHash = $trustedDevice->token_hash;

        $revokeTrustedDevice->handle($trustedDevice);

        return $this->noContentDroppingCookieFor($request, [$revokedTokenHash]);
    }

    public function destroyAll(#[CurrentUser] User $user, Request $request, RevokeAllTrustedDevices $revokeAllTrustedDevices): Response
    {
        $revokeAllTrustedDevices->handle($user);

        return $this->noContentDroppingCookieFor($request, null);
    }

    /**
     * A revoked row leaves a dead cookie in the browser that revoked it; drop
     * it so the next login does not present a token that cannot match.
     *
     * @param  ?list<string>  $revokedTokenHashes  null when every device went
     */
    private function noContentDroppingCookieFor(Request $request, ?array $revokedTokenHashes): Response
    {
        $token = TrustedDeviceCookie::tokenFrom($request);
        $response = response()->noContent();

        if ($token === null) {
            return $response;
        }

        $ownCookieRevoked = $revokedTokenHashes === null
            || in_array(TrustedDevice::hashToken($token), $revokedTokenHashes, true);

        return $ownCookieRevoked ? $response->withCookie(TrustedDeviceCookie::forget()) : $response;
    }
}
