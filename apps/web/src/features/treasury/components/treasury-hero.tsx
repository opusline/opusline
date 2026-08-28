import type {
  BankBalanceData,
  MoneyData,
  SignedMoneyData,
} from "@opusline/api-client";
import { Button } from "@opusline/ui/components/button";
import { eyebrowVariants } from "@opusline/ui/components/eyebrow";
import { cn } from "@opusline/ui/lib/utils";

import { useMoneyFormat } from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

type TreasuryHeroProps = {
  balance: BankBalanceData;
  transferable: SignedMoneyData;
  pendingTransfers: MoneyData;
  onRecord: () => void;
};

export function TreasuryHero({
  balance,
  transferable,
  pendingTransfers,
  onRecord,
}: TreasuryHeroProps) {
  const format = useMoneyFormat();

  const isShort = transferable.amount < 0;

  return (
    <section className="rounded-md border bg-card px-6 py-9 text-center">
      <div className={eyebrowVariants()}>{m.treasury_hero_label()}</div>
      <div
        className={cn(
          "mt-4 whitespace-nowrap font-mono font-medium text-5xl leading-none tracking-tight tabular-nums",
          isShort ? "text-destructive" : "text-primary-text",
        )}
      >
        {formatWholeAmount(format, transferable.amount)}
      </div>

      <p className="mt-3.5 text-muted-foreground-3 text-sm">
        {m.treasury_hero_on_balance({
          amount: formatWholeAmount(format, balance.amount.amount),
        })}
      </p>
      {pendingTransfers.amount > 0 && (
        <p className="mt-1.5 text-muted-foreground-3 text-xs">
          {m.treasury_hero_pending({
            amount: formatWholeAmount(format, pendingTransfers.amount),
          })}
        </p>
      )}
      {isShort && (
        <p className="mt-1.5 text-destructive text-xs">
          {m.treasury_hero_short({
            amount: formatWholeAmount(format, Math.abs(transferable.amount)),
          })}
        </p>
      )}

      <Button className="mt-6" onClick={onRecord} size="2xl">
        {m.treasury_record_button()}
      </Button>
    </section>
  );
}
