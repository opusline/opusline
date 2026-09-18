<?php

declare(strict_types=1);

namespace App\Domain\Bank\EnableBanking;

use App\Domain\Bank\Enums\BankPsuType;
use App\Domain\Bank\Enums\BankSyncError;
use Carbon\CarbonImmutable;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Enable Banking's account-information API, the relay between Opusline and
 * the bank's PSD2 interface.
 *
 * Failures never escape as Laravel's RequestException: that one carries the
 * response body, which for these endpoints can be the account's transactions,
 * and exceptions end up in logs and Sentry.
 *
 * @see https://enablebanking.com/docs/api/reference/
 */
class EnableBankingClient
{
    /** Pages of one transaction fetch. A window of weeks fits in a few; the cap stops a bank that never ends. */
    private const int MAX_PAGES = 50;

    /** The bank has no live consent behind this session or account any more. */
    private const array CONSENT_ERRORS = [
        'EXPIRED_SESSION',
        'CLOSED_SESSION',
        'REVOKED_SESSION',
        'SESSION_DOES_NOT_EXIST',
        'WRONG_SESSION_STATUS',
        'ACCOUNT_DOES_NOT_EXIST',
        'ASPSP_ACCOUNT_NOT_ACCESSIBLE',
        'EXPIRED_AUTHORIZATION_CODE',
        'WRONG_AUTHORIZATION_CODE',
        'ALREADY_AUTHORIZED',
    ];

    private const array CREDENTIAL_ERRORS = [
        'UNAUTHORIZED_ACCESS',
        'AUTHORIZATION_NOT_PROVIDED',
    ];

    /**
     * @throws BankSyncFailed
     */
    public function application(EnableBankingCredentials $credentials): EnableBankingApplication
    {
        $body = $this->json($this->call(fn (): Response => $this->request($credentials)->get('/application')));

        return new EnableBankingApplication(
            redirectUrls: $this->strings($body['redirect_urls'] ?? null),
            isActive: ($body['active'] ?? false) === true,
        );
    }

    /**
     * @return list<Aspsp>
     *
     * @throws BankSyncFailed
     */
    public function aspsps(EnableBankingCredentials $credentials, string $country): array
    {
        $body = $this->json($this->call(fn (): Response => $this->request($credentials)
            ->get('/aspsps', ['country' => $country, 'service' => 'AIS'])));

        return array_values(array_filter(array_map($this->aspsp(...), $this->list($body['aspsps'] ?? null))));
    }

    /**
     * Opens an authorization at the bank and returns where to send the browser.
     *
     * @throws BankSyncFailed
     */
    public function startAuthorization(
        EnableBankingCredentials $credentials,
        Aspsp $aspsp,
        BankPsuType $psuType,
        string $state,
        string $redirectUrl,
        CarbonImmutable $validUntil,
    ): string {
        $body = $this->json($this->call(fn (): Response => $this->request($credentials)->post('/auth', [
            'access' => [
                'valid_until' => $validUntil->toRfc3339String(),
                'balances' => true,
                'transactions' => true,
            ],
            'aspsp' => ['name' => $aspsp->name, 'country' => $aspsp->country],
            'state' => $state,
            'redirect_url' => $redirectUrl,
            'psu_type' => $psuType->apiValue(),
        ])));

        $url = $body['url'] ?? null;

        if (! is_string($url) || ! str_starts_with($url, 'https://')) {
            throw $this->unexpected('/auth');
        }

        return $url;
    }

    /**
     * Trades the code the bank sent back for a session and its accounts.
     *
     * @throws BankSyncFailed
     */
    public function createSession(EnableBankingCredentials $credentials, string $code): EnableBankingSession
    {
        $body = $this->json($this->call(fn (): Response => $this->request($credentials)
            ->post('/sessions', ['code' => $code])));

        $id = $body['session_id'] ?? null;
        $access = $body['access'] ?? null;
        $validUntil = is_array($access) ? $access['valid_until'] ?? null : null;

        if (! is_string($id) || $id === '' || ! is_string($validUntil)) {
            throw $this->unexpected('/sessions');
        }

        $accounts = array_values(array_filter(array_map($this->linkedAccount(...), $this->list($body['accounts'] ?? null))));

        try {
            $expiresAt = CarbonImmutable::parse($validUntil);
        } catch (Throwable $exception) {
            throw new BankSyncFailed(BankSyncError::Unavailable, 'Enable Banking returned an unreadable consent end.', $exception);
        }

        return new EnableBankingSession($id, $expiresAt, $accounts);
    }

    /**
     * Ends a consent at the bank. Best effort: the consent lapses on its own at
     * its end date, so a failure is logged rather than blocking what the user
     * asked for — disconnecting, reconnecting or removing the credentials.
     */
    public function revokeSession(EnableBankingCredentials $credentials, string $sessionId): void
    {
        try {
            $this->call(fn (): Response => $this->request($credentials)->delete('/sessions/'.rawurlencode($sessionId)));
        } catch (BankSyncFailed $exception) {
            Log::warning('Could not revoke an Enable Banking session.', [
                'reason' => $exception->reason->name,
                'message' => $exception->getMessage(),
            ]);
        }
    }

    /**
     * Booked transactions between two dates, both included, every page.
     *
     * @return list<array<array-key, mixed>>
     *
     * @throws BankSyncFailed
     */
    public function transactions(
        EnableBankingCredentials $credentials,
        string $accountUid,
        CarbonImmutable $from,
        CarbonImmutable $to,
        ?PsuContext $psu,
    ): array {
        $transactions = [];
        $continuationKey = null;
        $seenKeys = [];

        for ($page = 0; $page < self::MAX_PAGES; $page++) {
            $query = [
                'date_from' => $from->toDateString(),
                'date_to' => $to->toDateString(),
                'transaction_status' => 'BOOK',
            ];

            if ($continuationKey !== null) {
                $query['continuation_key'] = $continuationKey;
            }

            $body = $this->json($this->call(fn (): Response => $this->request($credentials, $psu)
                ->get('/accounts/'.rawurlencode($accountUid).'/transactions', $query)));

            if (! is_array($body['transactions'] ?? null)) {
                throw $this->unexpected('/transactions');
            }

            array_push($transactions, ...$this->list($body['transactions']));

            $continuationKey = $body['continuation_key'] ?? null;

            if (! is_string($continuationKey) || $continuationKey === '' || isset($seenKeys[$continuationKey])) {
                return $transactions;
            }

            $seenKeys[$continuationKey] = true;
        }

        throw new BankSyncFailed(BankSyncError::Unavailable, 'Enable Banking kept paginating past '.self::MAX_PAGES.' pages.');
    }

    /**
     * @return list<array<array-key, mixed>>
     *
     * @throws BankSyncFailed
     */
    public function balances(EnableBankingCredentials $credentials, string $accountUid, ?PsuContext $psu): array
    {
        $body = $this->json($this->call(fn (): Response => $this->request($credentials, $psu)
            ->get('/accounts/'.rawurlencode($accountUid).'/balances')));

        return $this->list($body['balances'] ?? null);
    }

    private function request(EnableBankingCredentials $credentials, ?PsuContext $psu = null): PendingRequest
    {
        return Http::baseUrl(config()->string('services.enable_banking.url'))
            ->timeout(config()->integer('services.enable_banking.timeout'))
            ->connectTimeout(5)
            ->acceptJson()
            ->withToken(EnableBankingJwt::sign($credentials, CarbonImmutable::now()))
            ->withHeaders($psu?->headers() ?? []);
    }

    /**
     * @param  callable(): Response  $send
     *
     * @throws BankSyncFailed
     */
    private function call(callable $send): Response
    {
        try {
            $response = $send();
        } catch (ConnectionException $exception) {
            throw new BankSyncFailed(BankSyncError::Unavailable, 'Could not reach Enable Banking.', $exception);
        }

        if ($response->failed()) {
            throw $this->failure($response);
        }

        return $response;
    }

    private function failure(Response $response): BankSyncFailed
    {
        $code = $response->json('error');
        $code = is_string($code) ? $code : '';

        $reason = match (true) {
            $code === 'ASPSP_RATE_LIMIT_EXCEEDED', $response->status() === 429 => BankSyncError::RateLimited,
            in_array($code, self::CONSENT_ERRORS, strict: true) => BankSyncError::ConsentExpired,
            $response->status() === 401, in_array($code, self::CREDENTIAL_ERRORS, strict: true) => BankSyncError::CredentialsRejected,
            default => BankSyncError::Unavailable,
        };

        return new BankSyncFailed($reason, trim("Enable Banking answered {$response->status()} {$code}").'.');
    }

    /**
     * @return array<array-key, mixed>
     *
     * @throws BankSyncFailed
     */
    private function json(Response $response): array
    {
        $body = $response->json();

        if (! is_array($body)) {
            throw new BankSyncFailed(BankSyncError::Unavailable, 'Enable Banking answered something other than a JSON object.');
        }

        return $body;
    }

    private function unexpected(string $endpoint): BankSyncFailed
    {
        return new BankSyncFailed(BankSyncError::Unavailable, "Enable Banking's {$endpoint} answer lacks an expected field.");
    }

    /**
     * @return list<array<array-key, mixed>>
     */
    private function list(mixed $value): array
    {
        return is_array($value) ? array_values(array_filter($value, is_array(...))) : [];
    }

    /**
     * @return list<string>
     */
    private function strings(mixed $value): array
    {
        return is_array($value) ? array_values(array_filter($value, is_string(...))) : [];
    }

    /**
     * @param  array<array-key, mixed>  $entry
     */
    private function aspsp(array $entry): ?Aspsp
    {
        $name = $entry['name'] ?? null;
        $country = $entry['country'] ?? null;

        if (! is_string($name) || $name === '' || ! is_string($country)) {
            return null;
        }

        $psuTypes = array_values(array_filter(array_map(
            BankPsuType::fromApiValue(...),
            $this->strings($entry['psu_types'] ?? null),
        )));

        $maximumConsent = $entry['maximum_consent_validity'] ?? null;

        return new Aspsp(
            name: $name,
            country: $country,
            psuTypes: $psuTypes,
            maximumConsentSeconds: is_int($maximumConsent) ? $maximumConsent : 0,
            isBeta: ($entry['beta'] ?? false) === true,
        );
    }

    /**
     * @param  array<array-key, mixed>  $entry
     */
    private function linkedAccount(array $entry): ?LinkedAccount
    {
        $uid = $entry['uid'] ?? null;
        $identificationHash = $entry['identification_hash'] ?? null;
        $currency = $entry['currency'] ?? null;

        if (! is_string($uid) || $uid === '' || ! is_string($identificationHash) || $identificationHash === '' || ! is_string($currency)) {
            return null;
        }

        $accountId = $entry['account_id'] ?? null;
        $iban = is_array($accountId) ? $accountId['iban'] ?? null : null;

        return new LinkedAccount(
            uid: $uid,
            identificationHash: $identificationHash,
            name: EnableBankingFields::firstString($entry, ['details', 'product', 'name']),
            // The full IBAN never leaves this method: four digits tell accounts apart.
            ibanLast4: is_string($iban) && strlen($iban) >= 4 ? substr($iban, -4) : null,
            currency: $currency,
        );
    }
}
