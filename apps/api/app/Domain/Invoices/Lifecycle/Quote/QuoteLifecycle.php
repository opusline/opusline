<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Lifecycle\Quote;

use App\Domain\Invoices\Enums\QuoteStatus;
use App\Domain\Invoices\Lifecycle\LifecycleCaster;
use Illuminate\Database\Eloquent\Model;
use Spatie\ModelStates\Attributes\AllowTransition;
use Spatie\ModelStates\State;

/**
 * Where a quote can go from where it stands. « Expiré » is not a state but a
 * condition on Sent (Quote::isExpired()): an expired quote takes no answer and
 * reopens onto itself with a fresh validity, a refused one reopens the same way.
 *
 * @extends State<Model>
 */
#[AllowTransition(QuoteDraft::class, QuoteSent::class)]
#[AllowTransition(QuoteSent::class, QuoteAccepted::class, DecideBeforeExpiry::class)]
#[AllowTransition(QuoteSent::class, QuoteRefused::class, DecideBeforeExpiry::class)]
#[AllowTransition(QuoteSent::class, QuoteSent::class, ReopenAfterExpiry::class)]
#[AllowTransition(QuoteRefused::class, QuoteSent::class)]
abstract class QuoteLifecycle extends State
{
    abstract public static function status(): QuoteStatus;

    /** The states are stored as the enum's value, so the column stays an int. */
    #[\Override]
    public static function getMorphClass(): string
    {
        return (string) static::status()->value;
    }

    #[\Override]
    public static function castUsing(array $arguments): LifecycleCaster
    {
        return new LifecycleCaster(self::class, $arguments[0] ?? throw new \InvalidArgumentException('Name the column the lifecycle rides on: QuoteLifecycle::class.\':status\'.'));
    }

    /** @return list<QuoteStatus> */
    public function nextStatuses(): array
    {
        /** @var array<numeric-string> $names */
        $names = $this->transitionableStates();

        return array_values(array_map(static fn (string $name): QuoteStatus => QuoteStatus::from((int) $name), $names));
    }
}
