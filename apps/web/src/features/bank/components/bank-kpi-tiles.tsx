import type { BankAccountData } from "@opusline/api-client";
import { Button } from "@opusline/ui/components/button";
import { StatTile, StatTileRow } from "@opusline/ui/components/stat-tile";
import { PencilIcon } from "lucide-react";

import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { bankBalanceSubLabel, bankBalanceTileValue } from "@/lib/bank";
import { formatWholeAmount } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

type BankKpiTilesProps = {
  data: BankAccountData;
  onEditBalance: () => void;
};

export function BankKpiTiles({ data, onEditBalance }: BankKpiTilesProps) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();

  const { balance, provisions, pendingMatches, statements } = data;
  const pendingCount = pendingMatches.length;

  return (
    <StatTileRow className="grid-cols-[repeat(auto-fit,minmax(11.25rem,1fr))]">
      <StatTile
        action={
          <Button
            aria-label={m.bank_balance_edit_aria()}
            onClick={onEditBalance}
            size="icon-sm"
            variant="ghost"
          >
            <PencilIcon aria-hidden />
          </Button>
        }
        label={m.bank_balance_tile()}
        size="lg"
        sub={bankBalanceSubLabel(dateFormat, balance)}
        tone={balance === null ? "quiet" : "strong"}
        value={bankBalanceTileValue(format, balance)}
      />
      <StatTile
        label={m.bank_provisions_tile()}
        size="lg"
        sub={
          provisions.vat === null
            ? m.bank_provisions_sub_no_vat()
            : m.bank_provisions_sub()
        }
        value={formatWholeAmount(format, provisions.total.amount)}
      />
      <StatTile
        label={m.bank_pending_tile()}
        size="lg"
        sub={
          statements.length === 0
            ? m.bank_pending_none_statement()
            : pendingCount > 0
              ? m.bank_pending_sub()
              : data.hasUnlinkedCredits
                ? m.bank_pending_none_suggested()
                : m.bank_pending_done()
        }
        tone={pendingCount > 0 ? "brand" : "quiet"}
        value={statements.length === 0 ? "—" : String(pendingCount)}
      />
    </StatTileRow>
  );
}
