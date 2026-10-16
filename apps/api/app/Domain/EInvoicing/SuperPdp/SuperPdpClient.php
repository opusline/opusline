<?php

declare(strict_types=1);

namespace App\Domain\EInvoicing\SuperPdp;

use App\Domain\EInvoicing\Enums\EInvoicingError;
use App\Domain\EInvoicing\Enums\PlatformEnvironment;
use App\Domain\EInvoicing\Platform\EInvoicingPlatformException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

/**
 * Super PDP's `v1.beta` API, as one account's own application.
 *
 * The sandbox and production share the host: the credentials decide which
 * side answers, and `companies/me` says which. Failures never escape as
 * Laravel's RequestException, whose message carries the response body.
 *
 * @see https://www.superpdp.tech/openapi/
 */
class SuperPdpClient
{
    private const string API_PREFIX = '/v1.beta';

    /** Refetch the token a little before the platform expires it. */
    private const int TOKEN_SKEW_SECONDS = 60;

    private const int DEFAULT_TOKEN_SECONDS = 1800;

    /**
     * @throws EInvoicingPlatformException
     */
    public function company(SuperPdpCredentials $credentials): SuperPdpCompany
    {
        $body = $this->json($this->get($credentials, '/companies/me'));
        $name = $body['trade_name'] ?? $body['formal_name'] ?? null;
        $number = $body['number'] ?? null;
        $environment = $body['env'] ?? null;

        if (! is_string($name) || $name === '') {
            throw $this->unexpected('/companies/me');
        }

        return new SuperPdpCompany(
            name: $name,
            number: is_string($number) && $number !== '' ? $number : null,
            environment: PlatformEnvironment::fromApiValue(is_string($environment) ? $environment : null),
        );
    }

    /**
     * Whether the platform finished verifying the company: until then every
     * business route answers 403.
     *
     * @throws EInvoicingPlatformException
     */
    public function isCompanyVerified(SuperPdpCredentials $credentials): bool
    {
        $body = $this->json($this->get($credentials, '/oauth2_sessions/me'));

        return ($body['company_verification_status'] ?? null) === 'verified';
    }

    /**
     * The annuaire's entries for a SIREN or SIRET, as addressing identifiers.
     *
     * @return list<string>
     *
     * @throws EInvoicingPlatformException
     */
    public function directoryEntries(SuperPdpCredentials $credentials, string $number): array
    {
        $body = $this->json($this->get($credentials, '/french_directory/entries', ['number' => $number]));
        $entries = [];

        foreach ($this->list($body['data'] ?? null) as $entry) {
            $identifier = $entry['addressing_identifier'] ?? $entry['identifier'] ?? null;

            if (is_string($identifier) && $identifier !== '') {
                $entries[] = $identifier;
            }
        }

        return $entries;
    }

    /**
     * Invoices the platform holds for the company, oldest first, one page.
     *
     * @return array{data: list<array<array-key, mixed>>, hasMore: bool}
     *
     * @throws EInvoicingPlatformException
     */
    public function invoices(SuperPdpCredentials $credentials, string $direction, ?string $startingAfterId, int $limit): array
    {
        $body = $this->json($this->get($credentials, '/invoices', array_filter([
            'direction' => $direction,
            'order' => 'asc',
            'limit' => $limit,
            'starting_after_id' => $startingAfterId,
        ], static fn (mixed $value): bool => $value !== null)));

        return [
            'data' => $this->list($body['data'] ?? null),
            'hasMore' => ($body['has_more'] ?? $body['has_after'] ?? false) === true,
        ];
    }

    /**
     * One invoice with its lifecycle events and its structured (EN 16931) content.
     *
     * @return array<array-key, mixed>
     *
     * @throws EInvoicingPlatformException
     */
    public function invoice(SuperPdpCredentials $credentials, string $id): array
    {
        return $this->json($this->get($credentials, '/invoices/'.rawurlencode($id), ['format' => 'en16931'], invoiceRoute: true));
    }

    /**
     * The file as it was deposited, bytes.
     *
     * @throws EInvoicingPlatformException
     */
    public function download(SuperPdpCredentials $credentials, string $id): string
    {
        return $this->get($credentials, '/invoices/'.rawurlencode($id), ['format' => 'original'], invoiceRoute: true)->body();
    }

    /**
     * Deposits a Factur-X PDF. The platform validates it synchronously and
     * answers 4xx with the reasons when it refuses.
     *
     * @return array<array-key, mixed>
     *
     * @throws EInvoicingPlatformException
     */
    public function createInvoice(SuperPdpCredentials $credentials, string $facturX, string $externalId): array
    {
        return $this->json($this->call($credentials, fn (): Response => $this->request($credentials)
            ->withBody($facturX, 'application/pdf')
            ->post(self::API_PREFIX.'/invoices?'.http_build_query(['external_id' => $externalId]))));
    }

    /**
     * Emits a lifecycle status on an invoice, the buyer's side of the cycle de vie.
     *
     * @throws EInvoicingPlatformException
     */
    public function createInvoiceEvent(SuperPdpCredentials $credentials, string $invoiceId, string $statusCode, ?string $reason): void
    {
        $this->call($credentials, fn (): Response => $this->request($credentials)->post(self::API_PREFIX.'/invoice_events', array_filter([
            'invoice_id' => $invoiceId,
            'status_code' => $statusCode,
            'data' => $reason === null ? null : ['reason' => $reason],
        ], static fn (mixed $value): bool => $value !== null)), invoiceRoute: true);
    }

    /**
     * @param  array<string, mixed>  $query
     *
     * @throws EInvoicingPlatformException
     */
    private function get(SuperPdpCredentials $credentials, string $path, array $query = [], bool $invoiceRoute = false): Response
    {
        return $this->call($credentials, fn (): Response => $this->request($credentials)->get(self::API_PREFIX.$path, $query), $invoiceRoute);
    }

    /**
     * @throws EInvoicingPlatformException
     */
    private function request(SuperPdpCredentials $credentials): PendingRequest
    {
        return $this->http()->acceptJson()->withToken($this->token($credentials));
    }

    private function http(): PendingRequest
    {
        return Http::baseUrl(config()->string('services.super_pdp.url'))
            ->timeout(config()->integer('services.super_pdp.timeout'))
            ->connectTimeout(5);
    }

    /**
     * The client-credentials token, kept until shortly before it expires. The
     * cache, not a static: Octane workers must not share one account's token.
     *
     * @throws EInvoicingPlatformException
     */
    private function token(SuperPdpCredentials $credentials): string
    {
        $key = $this->tokenKey($credentials);
        $cached = Cache::get($key);

        if (is_string($cached)) {
            return $cached;
        }

        $response = $this->send(fn (): Response => $this->http()->asForm()->post('/oauth2/token', [
            'grant_type' => 'client_credentials',
            'client_id' => $credentials->clientId,
            'client_secret' => $credentials->clientSecret,
        ]));

        // The token route is the one place a 400 means refused credentials.
        if ($response->failed()) {
            throw new EInvoicingPlatformException(
                in_array($response->status(), [400, 401], true) ? EInvoicingError::CredentialsRejected : EInvoicingError::Unavailable,
                "Super PDP's token route answered {$response->status()}.",
            );
        }

        $body = $this->json($response);
        $token = $body['access_token'] ?? null;
        $expiresIn = is_int($body['expires_in'] ?? null) ? $body['expires_in'] : self::DEFAULT_TOKEN_SECONDS;

        if (! is_string($token) || $token === '') {
            throw $this->unexpected('/oauth2/token');
        }

        Cache::put($key, $token, max(60, $expiresIn - self::TOKEN_SKEW_SECONDS));

        return $token;
    }

    private function tokenKey(SuperPdpCredentials $credentials): string
    {
        return 'super-pdp:token:'.hash('sha256', $credentials->clientId.':'.$credentials->clientSecret);
    }

    /**
     * Sends an authenticated call. On a 401 under a cached token the token is
     * dropped and the call made once more: the platform may revoke a token
     * before the cache expects it.
     *
     * @param  callable(): Response  $send
     * @param  bool  $invoiceRoute  A route about one invoice, where a 404 means that invoice and nothing else.
     *
     * @throws EInvoicingPlatformException
     */
    private function call(SuperPdpCredentials $credentials, callable $send, bool $invoiceRoute = false): Response
    {
        $response = $this->send($send);

        if ($response->status() === 401 && Cache::forget($this->tokenKey($credentials))) {
            $response = $this->send($send);
        }

        if ($response->failed()) {
            throw $this->failure($response, $invoiceRoute);
        }

        return $response;
    }

    /**
     * @param  callable(): Response  $send
     *
     * @throws EInvoicingPlatformException
     */
    private function send(callable $send): Response
    {
        try {
            return $send();
        } catch (ConnectionException $exception) {
            throw new EInvoicingPlatformException(EInvoicingError::Unavailable, 'Could not reach Super PDP.', $exception);
        }
    }

    private function failure(Response $response, bool $invoiceRoute): EInvoicingPlatformException
    {
        $status = $response->status();
        $reason = match (true) {
            $status === 401 => EInvoicingError::CredentialsRejected,
            $status === 403 => EInvoicingError::CompanyUnverified,
            $invoiceRoute && $status === 404 => EInvoicingError::NotFound,
            $status === 400, $status === 409, $status === 422 => EInvoicingError::Rejected,
            default => EInvoicingError::Unavailable,
        };

        return new EInvoicingPlatformException($reason, "Super PDP answered {$status}.");
    }

    /**
     * @return array<array-key, mixed>
     *
     * @throws EInvoicingPlatformException
     */
    private function json(Response $response): array
    {
        $body = $response->json();

        if (! is_array($body)) {
            throw new EInvoicingPlatformException(EInvoicingError::Unavailable, 'Super PDP answered something other than JSON.');
        }

        return $body;
    }

    private function unexpected(string $endpoint): EInvoicingPlatformException
    {
        return new EInvoicingPlatformException(EInvoicingError::Unavailable, "Super PDP's {$endpoint} answer lacks an expected field.");
    }

    /**
     * @return list<array<array-key, mixed>>
     */
    private function list(mixed $value): array
    {
        return is_array($value) ? array_values(array_filter($value, is_array(...))) : [];
    }
}
