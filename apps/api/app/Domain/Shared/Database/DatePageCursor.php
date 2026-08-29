<?php

declare(strict_types=1);

namespace App\Domain\Shared\Database;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\Relation;
use InvalidArgumentException;

/**
 * The opaque cursor behind the windowed lists: the (date, id) position of the
 * last row served, under a (date DESC, id DESC) order.
 *
 * Hand-rolled rather than cursorPaginate(): the paginator serializes a
 * date-cast column back as a full datetime string, and comparing that against
 * a DATE column re-includes the boundary row on MySQL — the position must
 * round-trip byte-identical. An undecodable cursor reads as null, and callers
 * serve the first page: a stale bookmark should show the newest rows, not 422.
 *
 * The boundary predicates and the fetch-one-extra window live here too, once:
 * every list that pages on a date column shares the exact comparison this
 * class's reason for existing is about.
 */
final readonly class DatePageCursor
{
    public function __construct(public string $date, public int $id) {}

    public static function decode(?string $encoded): ?self
    {
        if ($encoded === null) {
            return null;
        }

        $decoded = base64_decode($encoded, strict: true);

        if ($decoded === false) {
            return null;
        }

        if (preg_match('/^(\d{4}-\d{2}-\d{2})\|(\d{1,18})$/', $decoded, $matches) !== 1) {
            return null;
        }

        return new self($matches[1], (int) $matches[2]);
    }

    public function encode(): string
    {
        return base64_encode($this->date.'|'.$this->id);
    }

    /**
     * One (date DESC, id DESC) page of $query starting below $position, plus
     * the cursor for the page after it — null on the last one. Fetches one row
     * beyond the page so "more exists" is a fact, never a guess.
     *
     * @template TModel of Model
     *
     * @param  Builder<TModel>|HasMany<TModel, covariant Model>  $query
     * @return array{0: list<TModel>, 1: ?string} the page's rows, then the next cursor
     */
    public static function window(Builder|Relation $query, string $dateColumn, int $pageSize, ?self $position): array
    {
        $position?->filterOlderRows($query, $dateColumn);

        /** @var list<TModel> $rows */
        $rows = $query
            ->orderByDesc($dateColumn)
            ->orderByDesc('id')
            ->limit($pageSize + 1)
            ->get()
            ->all();

        if (count($rows) <= $pageSize) {
            return [$rows, null];
        }

        $rows = array_slice($rows, 0, $pageSize);

        return [$rows, self::positionOf($rows[$pageSize - 1], $dateColumn)->encode()];
    }

    private static function positionOf(Model $row, string $dateColumn): self
    {
        $date = $row->getAttribute($dateColumn);
        $id = $row->getKey();

        if (! $date instanceof CarbonInterface || ! is_int($id)) {
            throw new InvalidArgumentException("Column [{$dateColumn}] must carry a date cast, on an int-keyed model, to page on.");
        }

        return new self($date->toDateString(), $id);
    }

    /**
     * Only rows strictly below this position in the (date DESC, id DESC)
     * order — the page that follows it.
     *
     * @param  Builder<covariant Model>|HasMany<covariant Model, covariant Model>  $query
     */
    public function filterOlderRows(Builder|Relation $query, string $dateColumn): void
    {
        $query->where(function (Builder $olderThanPosition) use ($dateColumn): void {
            $olderThanPosition
                ->where($dateColumn, '<', $this->date)
                ->orWhere(function (Builder $sameDay) use ($dateColumn): void {
                    $sameDay->where($dateColumn, $this->date)->where('id', '<', $this->id);
                });
        });
    }

    /**
     * Only rows strictly above this position — everything the pages before it
     * already served.
     *
     * @param  Builder<covariant Model>|HasMany<covariant Model, covariant Model>  $query
     */
    public function filterNewerRows(Builder|Relation $query, string $dateColumn): void
    {
        $query->where(function (Builder $newerThanPosition) use ($dateColumn): void {
            $newerThanPosition
                ->where($dateColumn, '>', $this->date)
                ->orWhere(function (Builder $sameDay) use ($dateColumn): void {
                    $sameDay->where($dateColumn, $this->date)->where('id', '>', $this->id);
                });
        });
    }
}
