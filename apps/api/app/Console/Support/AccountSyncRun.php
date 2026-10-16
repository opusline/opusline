<?php

declare(strict_types=1);

namespace App\Console\Support;

use App\Domain\Shared\Sync\SyncRefused;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * The nightly loop every per-account sync shares: walk the connections in
 * chunks, count what synced, what the third party refused and what crashed,
 * and let no account stop the others.
 */
final readonly class AccountSyncRun
{
    public function __construct(private string $subject) {}

    /**
     * @template TConnection of Model
     *
     * @param  Builder<TConnection>  $connections
     * @param  callable(TConnection): mixed  $sync
     * @return array{synced: int, refused: int, crashed: int}
     */
    public function run(Builder $connections, callable $sync): array
    {
        $counts = ['synced' => 0, 'refused' => 0, 'crashed' => 0];

        $connections->chunkById(50, function (Collection $batch) use ($sync, &$counts): void {
            foreach ($batch as $connection) {
                try {
                    $sync($connection);
                    $counts['synced']++;
                } catch (SyncRefused $exception) {
                    // The connection records why, and the page that reads it says so.
                    $counts['refused']++;
                    Log::warning("Could not sync {$this->subject}.", [
                        'user_id' => $connection->getAttribute('user_id'),
                        'reason' => $exception->reason->name,
                    ]);
                } catch (Throwable $exception) {
                    // One account's bug must not stop everyone else's sync.
                    $counts['crashed']++;
                    report($exception);
                }
            }
        });

        return $counts;
    }

    /**
     * @param  array{synced: int, refused: int, crashed: int}  $counts
     */
    public function summary(array $counts): string
    {
        return "Synced {$counts['synced']} {$this->subject}(s), {$counts['refused']} refused, {$counts['crashed']} failed.";
    }

    /**
     * @param  array{synced: int, refused: int, crashed: int}  $counts
     */
    public function exitCode(array $counts): int
    {
        return $counts['crashed'] > 0 ? Command::FAILURE : Command::SUCCESS;
    }
}
