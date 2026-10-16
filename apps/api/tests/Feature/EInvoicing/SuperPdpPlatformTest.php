<?php

declare(strict_types=1);

use App\Domain\EInvoicing\Enums\EInvoicingError;
use App\Domain\EInvoicing\Enums\LifecycleStatus;
use App\Domain\EInvoicing\Platform\ConnectionCheck;
use App\Domain\EInvoicing\Platform\EInvoicingPlatformException;
use App\Domain\EInvoicing\Platform\SubmittedInvoice;
use App\Domain\EInvoicing\SuperPdp\SuperPdpClient;
use App\Domain\EInvoicing\SuperPdp\SuperPdpConnectionCheck;
use App\Domain\EInvoicing\SuperPdp\SuperPdpCredentials;
use App\Domain\EInvoicing\SuperPdp\SuperPdpPlatform;
use Carbon\CarbonImmutable;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;

/** The reason a platform call failed with, or null when it went through. */
function platformFailure(callable $call): ?EInvoicingError
{
    try {
        $call();
    } catch (EInvoicingPlatformException $exception) {
        return $exception->reason;
    }

    return null;
}

function superPdp(): SuperPdpPlatform
{
    return new SuperPdpPlatform(app(SuperPdpClient::class), new SuperPdpCredentials(SUPER_PDP_CLIENT_ID, SUPER_PDP_CLIENT_SECRET));
}

/**
 * @param  list<string>  $codes
 * @return array<string, mixed>
 */
function superPdpInvoice(int $id, array $codes, string $direction = 'in'): array
{
    return [
        'id' => $id,
        'direction' => $direction,
        'external_id' => null,
        'events' => array_map(static fn (string $code): array => ['status_code' => $code, 'created_at' => '2026-10-02T09:00:00Z'], $codes),
        'en_invoice' => [
            'number' => 'LUN-2026-0'.$id,
            'issue_date' => '2026-10-01',
            'payment_due_date' => '2026-10-31',
            'currency_code' => 'EUR',
            'seller' => ['name' => 'Lunaprint', 'legal_registration_identifier' => ['scheme' => '0002', 'value' => '851234567']],
            'totals' => ['total_without_vat' => '120.00', 'total_vat_amount' => '24.00', 'total_with_vat' => '144.00'],
        ],
    ];
}

test('lists the inbox page by page into received invoices', function (): void {
    fakeSuperPdp([
        'api.superpdp.tech/v1.beta/invoices?*' => Http::sequence()
            ->push(['data' => [['id' => 7], ['id' => 8]], 'has_more' => true])
            ->push(['data' => [['id' => 9]], 'has_more' => false]),
        'api.superpdp.tech/v1.beta/invoices/7?*' => Http::response(superPdpInvoice(7, ['fr:202'])),
        'api.superpdp.tech/v1.beta/invoices/8?*' => Http::response(superPdpInvoice(8, ['fr:202', 'fr:204'])),
        'api.superpdp.tech/v1.beta/invoices/9?*' => Http::response(superPdpInvoice(9, [])),
    ]);

    $received = superPdp()->listReceivedInvoices();

    expect($received)->toHaveCount(3)
        ->and($received[0]->platformId)->toBe('7')
        ->and($received[0]->supplierName)->toBe('Lunaprint')
        ->and($received[0]->supplierSiren)->toBe('851234567')
        ->and($received[0]->number)->toBe('LUN-2026-07')
        ->and($received[0]->issuedOn->toDateString())->toBe('2026-10-01')
        ->and($received[0]->dueOn?->toDateString())->toBe('2026-10-31')
        ->and($received[0]->amountHtCents)->toBe(12_000)
        ->and($received[0]->amountTtcCents)->toBe(14_400)
        ->and($received[1]->status)->toBe(LifecycleStatus::TakenInCharge)
        ->and($received[2]->status)->toBe(LifecycleStatus::Received);
    Http::assertSent(fn (Request $request): bool => str_contains($request->url(), '/v1.beta/invoices?')
        && str_contains($request->url(), 'direction=in') && str_contains($request->url(), 'starting_after_id=8'));
    Http::assertSentCount(1 + 2 + 3);
});

test('keeps only the invoices the platform touched since the asked moment', function (): void {
    fakeSuperPdp([
        'api.superpdp.tech/v1.beta/invoices?*' => Http::response(['data' => [['id' => 7], ['id' => 8]], 'has_more' => false]),
        'api.superpdp.tech/v1.beta/invoices/7?*' => Http::response(superPdpInvoice(7, ['fr:202'])),
        'api.superpdp.tech/v1.beta/invoices/8?*' => Http::response([
            ...superPdpInvoice(8, ['fr:202']),
            'events' => [['status_code' => 'fr:202', 'created_at' => '2026-09-20T09:00:00Z'], ['status_code' => 'fr:210', 'created_at' => '2026-10-05T09:00:00Z']],
        ]),
    ]);

    $changed = superPdp()->listReceivedInvoices(CarbonImmutable::parse('2026-10-03'));

    expect($changed)->toHaveCount(1)
        ->and($changed[0]->platformId)->toBe('8')
        ->and($changed[0]->status)->toBe(LifecycleStatus::Refused);
});

test('stops walking a platform that repeats its page', function (): void {
    fakeSuperPdp([
        'api.superpdp.tech/v1.beta/invoices?*' => Http::response(['data' => [['id' => 7]], 'has_more' => true]),
        'api.superpdp.tech/v1.beta/invoices/7?*' => Http::response(superPdpInvoice(7, ['fr:202'])),
    ]);

    expect(superPdp()->listReceivedInvoices())->toHaveCount(2);
    Http::assertSentCount(1 + 2 + 2);
});

test('leaves the supplier siren out when the identifier is not one', function (): void {
    $invoice = superPdpInvoice(7, ['fr:202']);
    $invoice['en_invoice']['seller']['legal_registration_identifier'] = ['scheme' => '9957', 'value' => 'FR32123456789'];
    fakeSuperPdp([
        'api.superpdp.tech/v1.beta/invoices?*' => Http::response(['data' => [['id' => 7]], 'has_more' => false]),
        'api.superpdp.tech/v1.beta/invoices/7?*' => Http::response($invoice),
    ]);

    expect(superPdp()->listReceivedInvoices()[0]->supplierSiren)->toBeNull();
});

test('drops a token the platform revoked early and tries once more', function (): void {
    fakeSuperPdp([
        'api.superpdp.tech/oauth2/token' => Http::sequence()
            ->push(['access_token' => 'tok_stale', 'expires_in' => 1800])
            ->push(['access_token' => 'tok_fresh', 'expires_in' => 1800]),
        'api.superpdp.tech/v1.beta/oauth2_sessions/me' => Http::sequence()
            ->push(['company_verification_status' => 'pending'])
            ->push(['error' => 'token_revoked'], 401)
            ->push(['company_verification_status' => 'pending']),
    ]);
    $platform = superPdp();

    expect($platform->check()->companyVerified)->toBeFalse()
        ->and($platform->check()->companyVerified)->toBeFalse();

    Http::assertSentCount(5);
    Http::assertSent(fn (Request $request): bool => ($request->header('Authorization')[0] ?? null) === 'Bearer tok_fresh');
});

test('reads a missing route as an outage, not a missing invoice', function (): void {
    fakeSuperPdp([
        'api.superpdp.tech/v1.beta/companies/me' => Http::response(['message' => 'Not found'], 404),
        'api.superpdp.tech/v1.beta/invoices/404?*' => Http::response(['message' => 'Not found'], 404),
    ]);

    expect(platformFailure(fn (): SuperPdpConnectionCheck => superPdp()->check()))->toBe(EInvoicingError::Unavailable)
        ->and(platformFailure(fn (): LifecycleStatus => superPdp()->invoiceStatus('404')))->toBe(EInvoicingError::NotFound);
});

test('fetches one token for a run of calls', function (): void {
    fakeSuperPdp([
        'api.superpdp.tech/v1.beta/invoices?*' => Http::response(['data' => [], 'has_more' => false]),
    ]);
    $platform = superPdp();

    $platform->listReceivedInvoices();
    $platform->lookupRecipient('851234567');

    Http::assertSentCount(3);
});

test('downloads the file as it was deposited', function (): void {
    fakeSuperPdp(['api.superpdp.tech/v1.beta/invoices/7?*' => Http::response('%PDF-1.7 facture', 200, ['Content-Type' => 'application/pdf'])]);

    expect(superPdp()->downloadReceivedInvoice('7'))->toStartWith('%PDF-');
    Http::assertSent(fn (Request $request): bool => str_contains($request->url(), '/v1.beta/invoices/7') && $request['format'] === 'original');
});

test('deposits a factur-x file and reads back the id and status', function (): void {
    fakeSuperPdp(['api.superpdp.tech/v1.beta/invoices?*' => Http::response(superPdpInvoice(42, ['fr:200'], 'out'), 201)]);

    $submitted = superPdp()->sendInvoice('%PDF-1.7 facture', '851234567');

    expect($submitted->platformId)->toBe('42')->and($submitted->status)->toBe(LifecycleStatus::Deposited);
    Http::assertSent(fn (Request $request): bool => $request->method() === 'POST'
        && str_contains($request->url(), '/v1.beta/invoices?external_id=851234567')
        && $request->header('Content-Type')[0] === 'application/pdf'
        && $request->body() === '%PDF-1.7 facture');
});

test('says when the platform refused the file', function (): void {
    fakeSuperPdp(['api.superpdp.tech/v1.beta/invoices?*' => Http::response(['message' => 'BR-FR-05 missing'], 422)]);

    expect(platformFailure(fn (): SubmittedInvoice => superPdp()->sendInvoice('%PDF-1.7', '851234567')))->toBe(EInvoicingError::Rejected);
});

test('reads an invoice status off its last known event', function (): void {
    fakeSuperPdp(['api.superpdp.tech/v1.beta/invoices/42?*' => Http::response(superPdpInvoice(42, ['fr:200', 'fr:201', 'fr:202', 'fr:999', 'fr:210'], 'out'))]);

    expect(superPdp()->invoiceStatus('42'))->toBe(LifecycleStatus::Refused);
});

test('reports a status with its reason', function (): void {
    fakeSuperPdp(['api.superpdp.tech/v1.beta/invoice_events' => Http::response(['id' => 1], 201)]);

    superPdp()->reportStatus('7', LifecycleStatus::Refused, 'Prestation non commandée');

    Http::assertSent(fn (Request $request): bool => $request->method() === 'POST'
        && str_ends_with($request->url(), '/v1.beta/invoice_events')
        && $request['invoice_id'] === '7' && $request['status_code'] === 'fr:210'
        && $request['data'] === ['reason' => 'Prestation non commandée']);
});

test('tells a reachable recipient from one the annuaire does not know', function (): void {
    fakeSuperPdp(['api.superpdp.tech/v1.beta/french_directory/entries*' => Http::sequence()
        ->push(['data' => [['addressing_identifier' => '0225:85123456700011']]])
        ->push(['data' => []])]);
    $platform = superPdp();

    expect($platform->lookupRecipient('851234567')->reachable)->toBeTrue()
        ->and($platform->lookupRecipient('999999999')->reachable)->toBeFalse();
});

test('names revoked credentials and an unreachable platform', function (): void {
    fakeSuperPdp(['api.superpdp.tech/oauth2/token' => Http::sequence()
        ->push(['error' => 'invalid_client'], 401)
        ->push(['message' => 'Down'], 502)]);

    expect(platformFailure(fn (): ConnectionCheck => superPdp()->check()))->toBe(EInvoicingError::CredentialsRejected)
        ->and(platformFailure(fn (): ConnectionCheck => superPdp()->check()))->toBe(EInvoicingError::Unavailable);
});

test('reports a company the platform has not verified without asking it more', function (): void {
    fakeSuperPdp(['api.superpdp.tech/v1.beta/oauth2_sessions/me' => Http::response(['company_verification_status' => 'pending'])]);

    expect(superPdp()->check()->companyVerified)->toBeFalse();
    Http::assertSentCount(2);
});
