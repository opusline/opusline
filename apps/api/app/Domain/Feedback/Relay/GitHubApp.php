<?php

declare(strict_types=1);

namespace App\Domain\Feedback\Relay;

use Carbon\CarbonImmutable;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * The relay's GitHub identity: a GitHub App installed on the repository. It
 * signs a short JWT with its private key, trades it for an installation token
 * (cached under its one-hour life), and files issues with that token.
 */
final class GitHubApp
{
    private const string API = 'https://api.github.com';

    public static function isConfigured(): bool
    {
        return filled(config('relay.github.app_id'))
            && filled(config('relay.github.private_key'))
            && filled(config('relay.github.installation_id'));
    }

    /**
     * @return array{number: int, url: string}
     */
    public function createIssue(string $title, string $body, string $type): array
    {
        $response = $this->client($this->installationToken())
            ->post('/repos/'.config()->string('relay.github.repository').'/issues', [
                'title' => $title,
                'body' => $body,
                'type' => $type,
            ])
            ->throw();

        $number = $response->json('number');
        $url = $response->json('html_url');

        if (! is_int($number) || ! is_string($url)) {
            throw new RuntimeException('GitHub answered the new issue without its number or address.');
        }

        return ['number' => $number, 'url' => $url];
    }

    private function installationToken(): string
    {
        return Cache::remember('relay-github-installation-token', 50 * 60, function (): string {
            $token = $this->client($this->jwt())
                ->post('/app/installations/'.config()->string('relay.github.installation_id').'/access_tokens')
                ->throw()
                ->json('token');

            if (! is_string($token)) {
                throw new RuntimeException('GitHub answered the installation token request without a token.');
            }

            return $token;
        });
    }

    /** RS256 by hand: the one JWT the relay ever signs does not warrant a library. */
    private function jwt(): string
    {
        $now = CarbonImmutable::now()->getTimestamp();
        $segments = [
            $this->base64Url((string) json_encode(['alg' => 'RS256', 'typ' => 'JWT'])),
            // Backdated a minute: GitHub refuses a token issued in its future when clocks drift.
            $this->base64Url((string) json_encode(['iat' => $now - 60, 'exp' => $now + 540, 'iss' => config()->string('relay.github.app_id')])),
        ];
        $privateKey = str_replace('\n', "\n", config()->string('relay.github.private_key'));

        if (! openssl_sign(implode('.', $segments), $signature, $privateKey, OPENSSL_ALGO_SHA256) || ! is_string($signature)) {
            throw new RuntimeException('The relay could not sign its GitHub App token: check RELAY_GITHUB_PRIVATE_KEY.');
        }

        return implode('.', [...$segments, $this->base64Url($signature)]);
    }

    private function client(string $bearer): PendingRequest
    {
        return Http::baseUrl(self::API)
            ->withToken($bearer)
            ->withHeaders(['Accept' => 'application/vnd.github+json', 'X-GitHub-Api-Version' => '2022-11-28'])
            ->timeout(10);
    }

    private function base64Url(string $value): string
    {
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }
}
