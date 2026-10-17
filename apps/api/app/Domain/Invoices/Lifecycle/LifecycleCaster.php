<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Lifecycle;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use InvalidArgumentException;
use Spatie\ModelStates\State;

/**
 * Casts a lifecycle attribute that rides on another column.
 *
 * `status` keeps its int-backed enum, so payloads, queries, factories and the
 * generated client never see a state class; `lifecycle` reads the same column
 * into the state machine and a transition writes back the enum's value. The
 * state object is never cached: a cached copy would be re-saved over a status
 * set directly, and the enum cast on the column is what everyone else reads.
 *
 * @implements CastsAttributes<State<Model>|null, State<Model>|class-string<State<Model>>>
 */
class LifecycleCaster implements CastsAttributes
{
    public bool $withoutObjectCaching = true;

    /**
     * @param  class-string<State<Model>>  $lifecycle  the abstract state the document's states extend
     * @param  string  $column  the int enum column the states are stored in
     */
    public function __construct(
        private readonly string $lifecycle,
        private readonly string $column,
    ) {}

    /** @return State<Model>|null */
    public function get(Model $model, string $key, mixed $value, array $attributes): ?State
    {
        $status = $attributes[$this->column] ?? null;

        if (! is_int($status) && ! is_string($status)) {
            return null;
        }

        return $this->lifecycle::make((string) $status, $model)->setField($key);
    }

    /** @return array<string, int> */
    public function set(Model $model, string $key, mixed $value, array $attributes): array
    {
        $state = $value instanceof State ? $value::class : $value;

        if (! is_string($state) || ! is_subclass_of($state, $this->lifecycle)) {
            throw new InvalidArgumentException(sprintf('%s::$%s takes a %s.', $model::class, $key, $this->lifecycle));
        }

        return [$this->column => (int) $state::getMorphClass()];
    }
}
