<?php

declare(strict_types=1);

namespace App\Domain\Bank\EnableBanking;

/** An account a consent gave access to. */
final readonly class LinkedAccount
{
    public function __construct(
        /** Only valid for the session that returned it. */
        public string $uid,
        /** Stable across sessions: how a reconnection recognizes the same account. */
        public string $identificationHash,
        public ?string $name,
        public ?string $ibanLast4,
        public string $currency,
    ) {}

    /**
     * @return array{uid: string, identificationHash: string, name: ?string, ibanLast4: ?string, currency: string}
     */
    public function toArray(): array
    {
        return [
            'uid' => $this->uid,
            'identificationHash' => $this->identificationHash,
            'name' => $this->name,
            'ibanLast4' => $this->ibanLast4,
            'currency' => $this->currency,
        ];
    }

    /**
     * @param  array{uid: string, identificationHash: string, name: ?string, ibanLast4: ?string, currency: string}  $stored
     */
    public static function fromArray(array $stored): self
    {
        return new self($stored['uid'], $stored['identificationHash'], $stored['name'], $stored['ibanLast4'], $stored['currency']);
    }
}
