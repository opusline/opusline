<?php

declare(strict_types=1);

use App\Domain\Feedback\Enums\ReportKind;
use App\Domain\Feedback\Enums\ReportSpeaker;
use App\Domain\Users\Models\User;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Testing\TestResponse;

beforeEach(function (): void {
    config()->set('reports.relay_url', 'https://relay.opusline.test');
    config()->set('services.anthropic.model', 'claude-opus-5-5');
});

/** A Claude answer in the shape the conversation's schema asks for. */
function conversationAnswer(array $answer, string $stopReason = 'end_turn'): array
{
    return [
        'id' => 'msg_turn',
        'type' => 'message',
        'role' => 'assistant',
        'model' => 'claude-opus-5-5',
        'content' => [
            ['type' => 'thinking', 'thinking' => '', 'signature' => 'sig-final'],
            ['type' => 'text', 'text' => json_encode(['reply' => 'What did you expect to see?', 'draft' => null, 'duplicateNumbers' => [], ...$answer])],
        ],
        'stop_reason' => $stopReason,
        'stop_sequence' => null,
        'usage' => ['input_tokens' => 900, 'output_tokens' => 120],
    ];
}

function searchCall(string $query = 'invoice preview cut'): array
{
    return [
        'id' => 'msg_search',
        'type' => 'message',
        'role' => 'assistant',
        'model' => 'claude-opus-5-5',
        'content' => [
            ['type' => 'thinking', 'thinking' => '', 'signature' => 'sig-search'],
            ['type' => 'tool_use', 'id' => 'toolu_1', 'name' => 'search_open_issues', 'input' => ['query' => $query]],
        ],
        'stop_reason' => 'tool_use',
        'stop_sequence' => null,
        'usage' => ['input_tokens' => 800, 'output_tokens' => 40],
    ];
}

/** @param list<array<string, mixed>> $answers One Claude response per call, in order. */
function fakeConversation(array $answers, mixed $github = null): void
{
    $sequence = Http::sequence();

    foreach ($answers as $answer) {
        $sequence->push($answer);
    }

    Http::fake([
        'api.anthropic.com/v1/messages' => $sequence,
        'api.github.com/search/issues*' => $github ?? Http::response(['items' => [
            ['number' => 612, 'title' => 'Invoice preview cut on narrow screens', 'html_url' => 'https://evil.example/612'],
            ['number' => 598, 'title' => 'Totals column overlaps the margin', 'html_url' => 'https://github.com/opusline/opusline/issues/598'],
        ]]),
    ]);
}

/** @param list<array{0: ReportSpeaker, 1: string}> $lines */
function converse(array $lines = [[ReportSpeaker::Account, 'The invoice preview is cut on the right.']], ?User $user = null): TestResponse
{
    return test()->actingAs($user ?? withAnthropicApiKey(User::factory()->create()))
        ->postJson('/api/reports/conversation', ['messages' => array_map(
            static fn (array $line): array => ['speaker' => $line[0]->value, 'text' => $line[1]],
            $lines,
        )]);
}

/** @return list<Request> */
function claudeRequests(): array
{
    return Http::recorded(fn (Request $request): bool => $request->url() === 'https://api.anthropic.com/v1/messages')
        ->map(fn (array $pair): Request => $pair[0])
        ->values()
        ->all();
}

test('asks back what a maintainer would need', function (): void {
    fakeConversation([conversationAnswer([])]);

    converse()
        ->assertOk()
        ->assertExactJson(['reply' => 'What did you expect to see?', 'draft' => null, 'duplicates' => []]);
});

test('sends the conversation as text, the account as the user', function (): void {
    fakeConversation([conversationAnswer([])]);

    converse([
        [ReportSpeaker::Account, 'The preview is cut.'],
        [ReportSpeaker::Claude, 'On which screen?'],
        [ReportSpeaker::Account, 'The invoice editor, at 1280 px.'],
    ])->assertOk();

    expect(claudeRequests()[0]->data()['messages'])->toBe([
        ['content' => 'The preview is cut.', 'role' => 'user'],
        ['content' => 'On which screen?', 'role' => 'assistant'],
        ['content' => 'The invoice editor, at 1280 px.', 'role' => 'user'],
    ]);
});

test('proposes the draft claude wrote', function (): void {
    fakeConversation([conversationAnswer([
        'reply' => 'Here is a draft.',
        'draft' => ['kind' => 'bug', 'title' => 'Invoice preview cut at 1280 px', 'body' => "## What happened\nThe totals column is hidden."],
    ])]);

    converse()
        ->assertOk()
        ->assertJsonPath('draft.kind', ReportKind::Bug->value)
        ->assertJsonPath('draft.title', 'Invoice preview cut at 1280 px');
});

test('keeps the draft within what the report accepts', function (): void {
    fakeConversation([conversationAnswer([
        'draft' => ['kind' => 'feature', 'title' => str_repeat('a', 300), 'body' => str_repeat('b', 9000)],
    ])]);

    $draft = converse()->assertOk()->json('draft');

    expect(mb_strlen($draft['title']))->toBe(120)
        ->and(mb_strlen($draft['body']))->toBe(6000);
});

test('searches the open issues and lists the ones claude calls duplicates', function (): void {
    fakeConversation([searchCall(), conversationAnswer(['duplicateNumbers' => [612, 4242]])]);

    converse()
        ->assertOk()
        ->assertJsonPath('duplicates', [
            ['number' => 612, 'title' => 'Invoice preview cut on narrow screens', 'url' => 'https://github.com/opusline/opusline/issues/612'],
        ]);

    Http::assertSent(fn (Request $request): bool => str_starts_with($request->url(), 'https://api.github.com/search/issues')
        && $request->data()['q'] === 'repo:opusline/opusline is:issue is:open invoice preview cut');
});

test('replays claude own turn untouched before the search results', function (): void {
    fakeConversation([searchCall(), conversationAnswer([])]);

    converse()->assertOk();

    $followUp = claudeRequests()[1]->data()['messages'];

    expect($followUp[1]['role'])->toBe('assistant')
        ->and($followUp[1]['content'][0])->toMatchArray(['type' => 'thinking', 'signature' => 'sig-search'])
        ->and($followUp[1]['content'][1])->toMatchArray(['type' => 'tool_use', 'id' => 'toolu_1'])
        ->and($followUp[2]['content'][0])->toMatchArray(['type' => 'tool_result', 'tool_use_id' => 'toolu_1']);
});

test('tells claude when the search is unavailable', function (): void {
    fakeConversation([searchCall(), conversationAnswer([])], github: Http::response(['message' => 'API rate limit exceeded'], 403));

    converse()->assertOk()->assertJsonPath('duplicates', []);

    expect(claudeRequests()[1]->data()['messages'][2]['content'][0])->toMatchArray(['type' => 'tool_result', 'is_error' => true]);
});

test('stops offering the search after three rounds', function (): void {
    fakeConversation([searchCall('a'), searchCall('b'), searchCall('c'), conversationAnswer([])]);

    converse()->assertOk();

    $requests = claudeRequests();

    expect($requests)->toHaveCount(4)
        ->and($requests[2]->data()['tool_choice'])->toBe(['type' => 'auto'])
        ->and($requests[3]->data()['tool_choice'])->toBe(['type' => 'none'])
        ->and($requests[3]->data()['tools'])->toBe($requests[0]->data()['tools']);
});

test('needs the account anthropic key', function (): void {
    Http::fake();

    converse(user: User::factory()->create())
        ->assertConflict()
        ->assertJsonPath('message', __('feedback.conversation_needs_key'));

    Http::assertNothingSent();
});

test('refuses a conversation out of turn', function (array $lines): void {
    Http::fake();

    converse($lines)->assertUnprocessable()->assertJsonValidationErrors('messages');

    Http::assertNothingSent();
})->with([
    'opened by claude' => [[[ReportSpeaker::Claude, 'Hello'], [ReportSpeaker::Account, 'Hi']]],
    'ended by claude' => [[[ReportSpeaker::Account, 'Hi'], [ReportSpeaker::Claude, 'Hello']]],
    'two lines in a row' => [[[ReportSpeaker::Account, 'Hi'], [ReportSpeaker::Account, 'Again']]],
]);

test('says when anthropic refuses the key', function (): void {
    Http::fake(['api.anthropic.com/*' => Http::response(['type' => 'error', 'error' => ['type' => 'authentication_error', 'message' => 'no']], 401)]);

    converse()->assertUnprocessable()->assertJsonPath('errors.messages.0', __('settings.anthropic_key_rejected'));
});

test('says when claude cannot be reached', function (): void {
    Http::fake(['api.anthropic.com/*' => fn () => Http::response(['type' => 'error', 'error' => ['type' => 'overloaded_error', 'message' => 'busy']], 529)]);

    converse()->assertServiceUnavailable()->assertJsonPath('message', __('feedback.conversation_unavailable'));
});

test('says when claude gives no usable answer', function (array $answer): void {
    fakeConversation([$answer]);

    converse()->assertStatus(502)->assertJsonPath('message', __('feedback.conversation_failed'));
})->with([
    'a refusal' => [conversationAnswer([], 'refusal')],
    'an empty reply' => [conversationAnswer(['reply' => '  '])],
]);

test('is off with the reporter', function (): void {
    config()->set('reports.enabled', false);
    Http::fake();

    converse()->assertNotFound();
});
