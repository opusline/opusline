<?php

declare(strict_types=1);

namespace App\Domain\Feedback\Reporting;

use App\Domain\Feedback\Data\OpenIssueData;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

/**
 * Searches the project's open issues through GitHub's public search, with
 * no credential: the repository is public, and the instance holds no token.
 */
class OpenIssueSearch
{
    /** @return list<OpenIssueData>|null Null when GitHub did not answer. */
    public function search(string $terms): ?array
    {
        $repository = config()->string('reports.repository');

        try {
            $response = Http::acceptJson()->timeout(10)->get('https://api.github.com/search/issues', [
                'q' => "repo:{$repository} is:issue is:open {$terms}",
                'per_page' => 5,
            ]);
        } catch (ConnectionException) {
            return null;
        }

        $items = $response->json('items');

        if ($response->failed() || ! is_array($items)) {
            return null;
        }

        $issues = [];

        foreach ($items as $item) {
            if (is_array($item) && is_int($item['number'] ?? null) && is_string($item['title'] ?? null)) {
                // The link is built here rather than taken from the answer, so
                // it can only ever point at the project's own tracker.
                $issues[] = new OpenIssueData($item['number'], $item['title'], "https://github.com/{$repository}/issues/{$item['number']}");
            }
        }

        return $issues;
    }
}
