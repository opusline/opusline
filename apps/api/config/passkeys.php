<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Relying party
    |--------------------------------------------------------------------------
    |
    | WebAuthn binds every passkey to a relying-party id (a bare host) and only
    | accepts assertions from listed origins. Both default to the app URL, plus
    | the Sanctum stateful domains for the origins, so a standard install needs
    | nothing here. Override when the SPA is served from another host.
    |
    */

    'rp_id' => env('PASSKEYS_RP_ID'),

    'origins' => env('PASSKEYS_ORIGINS'),

];
