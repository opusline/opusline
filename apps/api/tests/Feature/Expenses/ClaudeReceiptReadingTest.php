<?php

declare(strict_types=1);

use App\Domain\Expenses\Enums\ClaudeReadingFailure;
use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Expenses\Enums\ReceiptFieldConfidence;
use App\Domain\Expenses\Enums\ReceiptReader;
use App\Domain\Users\Models\User;
use Illuminate\Http\Client\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Testing\TestResponse;

beforeEach(function (): void {
    freezeTodayAtUtcNoon();
    config()->set('services.anthropic.model', 'claude-opus-5-5');
});

/** What Claude returns for the fictional Nordlys Cloud invoice, before any override. */
function claudeReading(array $overrides = []): array
{
    return [
        'supplier' => 'Nordlys Cloud',
        'issuedOn' => '2026-08-02',
        'total' => ['minorUnits' => 4_800, 'currency' => 'EUR'],
        'vat' => ['treatment' => 'domestic', 'rateBasisPoints' => 2_000],
        'description' => 'Hébergement août',
        'category' => 'hosting',
        'confidence' => ['supplier' => 'high', 'issuedOn' => 'high', 'total' => 'high', 'vat' => 'medium', 'description' => 'low'],
        ...$overrides,
    ];
}

function fakeClaudeAnswer(mixed $reading, string $stopReason = 'end_turn'): void
{
    Http::fake(['api.anthropic.com/v1/messages' => Http::response([
        'id' => 'msg_receipt',
        'type' => 'message',
        'role' => 'assistant',
        'model' => 'claude-opus-5-5',
        'content' => [['type' => 'text', 'text' => is_string($reading) ? $reading : json_encode($reading)]],
        'stop_reason' => $stopReason,
        'stop_sequence' => null,
        'usage' => ['input_tokens' => 1_200, 'output_tokens' => 180],
    ])]);
}

function readWithClaude(UploadedFile $file, ?User $user = null): TestResponse
{
    return test()->actingAs($user ?? withAnthropicApiKey(User::factory()->create()))
        ->post('/api/expenses/receipt-reading', ['file' => $file], ['Accept' => 'application/json']);
}

function scannedReceipt(): UploadedFile
{
    return UploadedFile::fake()->createWithContent('scan.pdf', '%PDF-1.4 a scan with no text layer');
}

test('reads a receipt with claude when the account gave a key', function (): void {
    fakeClaudeAnswer(claudeReading());

    readWithClaude(scannedReceipt())
        ->assertOk()
        ->assertJsonPath('textFound', true)
        ->assertJsonPath('reader', ReceiptReader::Claude->value)
        ->assertJsonPath('claudeFailure', null)
        ->assertJsonPath('supplier.value', 'Nordlys Cloud')
        ->assertJsonPath('supplier.confidence', ReceiptFieldConfidence::High->value)
        ->assertJsonPath('spentOn.value', '2026-08-02')
        ->assertJsonPath('amountTtc.value', ['amount' => 4_800, 'currency' => 'EUR'])
        ->assertJsonPath('vat.treatment', ExpenseVatTreatment::Domestic->value)
        ->assertJsonPath('vat.rateBp', 2_000)
        ->assertJsonPath('vat.confidence', ReceiptFieldConfidence::Medium->value)
        ->assertJsonPath('description.confidence', ReceiptFieldConfidence::Low->value)
        ->assertJsonPath('category', ExpenseCategory::Hosting->value);
});

test('sends the file to claude on the account key with a reading schema', function (string $name, string $blockType, string $mediaType): void {
    fakeClaudeAnswer(claudeReading());

    $file = $blockType === 'image' ? UploadedFile::fake()->image($name) : scannedReceipt();
    readWithClaude($file)->assertOk();

    Http::assertSent(function (Request $request) use ($blockType, $mediaType): bool {
        $block = $request->data()['messages'][0]['content'][0];

        return $request->url() === 'https://api.anthropic.com/v1/messages'
            && $request->hasHeader('x-api-key', ANTHROPIC_TEST_KEY)
            && $request->data()['model'] === 'claude-opus-5-5'
            && $request->data()['output_config']['format']['type'] === 'json_schema'
            && $block['type'] === $blockType
            && $block['source']['media_type'] === $mediaType;
    });
})->with([
    'a PDF' => ['scan.pdf', 'document', 'application/pdf'],
    'a photo' => ['ticket.jpg', 'image', 'image/jpeg'],
]);

test('leaves the amount for the user to convert when the receipt is in another currency', function (): void {
    fakeClaudeAnswer(claudeReading(['total' => ['minorUnits' => 5_000, 'currency' => 'USD']]));

    readWithClaude(scannedReceipt())->assertOk()->assertJsonPath('amountTtc', null);
});

test('drops what claude said in a shape the form cannot take', function (string $field, array $overrides): void {
    fakeClaudeAnswer(claudeReading($overrides));

    readWithClaude(scannedReceipt())->assertOk()->assertJsonPath($field, null);
})->with([
    'a date in the future' => ['spentOn', ['issuedOn' => '2027-01-01']],
    'a date that does not exist' => ['spentOn', ['issuedOn' => '2026-02-30']],
    'a negative total' => ['amountTtc', ['total' => ['minorUnits' => -100, 'currency' => 'EUR']]],
    'a rate above 100 %' => ['vat', ['vat' => ['treatment' => 'domestic', 'rateBasisPoints' => 12_000]]],
    'an unknown category' => ['category', ['category' => 'yachts']],
    'an empty supplier' => ['supplier', ['supplier' => '  ']],
]);

test('falls back to the heuristics and says why when claude cannot read', function (int $status, ClaudeReadingFailure $failure): void {
    // A fresh response per call: the SDK retries a 429 or a 529 once.
    Http::fake(['api.anthropic.com/v1/messages' => fn () => Http::response(['type' => 'error', 'error' => ['type' => 'error', 'message' => 'no']], $status)]);

    readWithClaude(scannedReceipt())
        ->assertOk()
        ->assertJsonPath('reader', ReceiptReader::Heuristics->value)
        ->assertJsonPath('claudeFailure', $failure->value)
        ->assertJsonPath('textFound', false);
})->with([
    'a revoked key' => [401, ClaudeReadingFailure::KeyRejected],
    'a file anthropic refuses' => [400, ClaudeReadingFailure::Unreadable],
    'a rate limit' => [429, ClaudeReadingFailure::Unavailable],
    'an outage' => [529, ClaudeReadingFailure::Unavailable],
]);

test('falls back to the heuristics when claude gives no usable reading', function (mixed $answer, string $stopReason): void {
    fakeClaudeAnswer($answer, $stopReason);

    readWithClaude(scannedReceipt())
        ->assertOk()
        ->assertJsonPath('reader', ReceiptReader::Heuristics->value)
        ->assertJsonPath('claudeFailure', ClaudeReadingFailure::Unreadable->value);
})->with([
    'a refusal' => [claudeReading(), 'refusal'],
    'a cut-off answer' => ['{"supplier": "Nord', 'max_tokens'],
    'prose instead of JSON' => ['I cannot read this receipt.', 'end_turn'],
]);

test('falls back to the heuristics when anthropic is unreachable', function (): void {
    Http::fake(['api.anthropic.com/*' => Http::failedConnection()]);

    readWithClaude(scannedReceipt())
        ->assertOk()
        ->assertJsonPath('claudeFailure', ClaudeReadingFailure::Unavailable->value);
});

test('keeps reading with the heuristics alone for an account without a key', function (): void {
    Http::fake();

    readWithClaude(scannedReceipt(), User::factory()->create())
        ->assertOk()
        ->assertJsonPath('reader', ReceiptReader::Heuristics->value)
        ->assertJsonPath('claudeFailure', null);

    Http::assertNothingSent();
});
