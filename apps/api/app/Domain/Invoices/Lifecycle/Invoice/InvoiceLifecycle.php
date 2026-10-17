<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Lifecycle\Invoice;

use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Lifecycle\LifecycleCaster;
use Illuminate\Database\Eloquent\Model;
use Spatie\ModelStates\Attributes\AllowTransition;
use Spatie\ModelStates\State;

/**
 * Where an invoice can go from where it stands. Issuing and marking as sent
 * both move a draft to Sent: the source decides which action does it.
 *
 * @extends State<Model>
 */
#[AllowTransition(InvoiceDraft::class, InvoiceSent::class)]
#[AllowTransition(InvoiceSent::class, InvoicePaid::class)]
abstract class InvoiceLifecycle extends State
{
    abstract public static function status(): InvoiceStatus;

    /** The states are stored as the enum's value, so the column stays an int. */
    #[\Override]
    public static function getMorphClass(): string
    {
        return (string) static::status()->value;
    }

    #[\Override]
    public static function castUsing(array $arguments): LifecycleCaster
    {
        return new LifecycleCaster(self::class, $arguments[0] ?? throw new \InvalidArgumentException('Name the column the lifecycle rides on: InvoiceLifecycle::class.\':status\'.'));
    }

    /** @return list<InvoiceStatus> */
    public function nextStatuses(): array
    {
        /** @var array<numeric-string> $names */
        $names = $this->transitionableStates();

        return array_values(array_map(static fn (string $name): InvoiceStatus => InvoiceStatus::from((int) $name), $names));
    }
}
