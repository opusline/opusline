<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Vat;

use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Shared\Money\Rate;
use Cknow\Money\Money;

/**
 * The three amounts of one purchase and the TVA the fisc sees on it, in one
 * place so the journal, the CA3 and the provisions cannot round differently.
 *
 * TTC is the typed figure (it is what the receipt says); HT is derived from it.
 * Under reverse charge or exemption the invoice carries no TVA, so HT equals TTC.
 */
final readonly class ExpenseAmounts
{
    public function __construct(
        public Money $ht,
        public Money $ttc,
        private ExpenseVatTreatment $treatment,
        private int $rateBp,
    ) {}

    /** A subscription is priced HT; the TTC follows from the treatment. */
    public static function fromHt(Money $ht, ExpenseVatTreatment $treatment, int $rateBp): self
    {
        $ttc = $treatment === ExpenseVatTreatment::Domestic ? $ht->add(Rate::of($ht, $rateBp)) : $ht;

        return new self(ht: $ht, ttc: $ttc, treatment: $treatment, rateBp: $rateBp);
    }

    public static function fromTtc(Money $ttc, ExpenseVatTreatment $treatment, int $rateBp): self
    {
        $ht = $treatment === ExpenseVatTreatment::Domestic ? Rate::netOf($ttc, $rateBp) : $ttc;

        return new self($ht, $ttc, $treatment, $rateBp);
    }

    /** The TVA printed on the receipt — only a domestic supplier charges any. */
    public function invoicedVat(): Money
    {
        return $this->ttc->subtract($this->ht);
    }

    /**
     * The TVA the CA3 sees: what was invoiced, or what the user self-assesses
     * under reverse charge; nothing when exempt.
     */
    public function assessedVat(): Money
    {
        return match ($this->treatment) {
            ExpenseVatTreatment::Domestic => $this->invoicedVat(),
            ExpenseVatTreatment::ReverseChargeEu,
            ExpenseVatTreatment::ReverseChargeNonEu => Rate::of($this->ht, $this->rateBp),
            ExpenseVatTreatment::Exempt => new Money(0, $this->ht->getCurrency()->getCode()),
        };
    }

    /**
     * The share of the assessed TVA the business may deduct — a purchase used
     * partly for private life only recovers its professional share.
     */
    public function recoverableVat(int $proShareBp): Money
    {
        return Rate::of($this->assessedVat(), $proShareBp);
    }
}
