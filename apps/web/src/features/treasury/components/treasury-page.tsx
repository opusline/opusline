import type { TreasuryData } from "@opusline/api-client";
import { Button } from "@opusline/ui/components/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@opusline/ui/components/empty";
import { cn } from "@opusline/ui/lib/utils";
import { Link } from "@tanstack/react-router";

import { m } from "@/paraglide/messages.js";

import { PastTransfersCard } from "./past-transfers-card";
import { TreasuryBreakdown } from "./treasury-breakdown";
import { TreasuryHero } from "./treasury-hero";

type TreasuryPageProps = {
  data: TreasuryData;
  isRefreshing: boolean;
  deletingTransferId: number | null;
  onRecord: () => void;
  onDeleteTransfer: (transferId: number) => void;
};

export function TreasuryPage({
  data,
  isRefreshing,
  deletingTransferId,
  onRecord,
  onDeleteTransfer,
}: TreasuryPageProps) {
  // The API sets these together; narrowing here is what lets the hero take
  // them non-null instead of re-checking what the empty state already decided.
  const { balance, transferable } = data;

  return (
    <div
      aria-busy={isRefreshing || undefined}
      className={cn(
        "mx-auto flex w-full max-w-4xl flex-col gap-3.5 transition-opacity",
        isRefreshing && "opacity-60",
      )}
    >
      <div className="min-w-0">
        <h1 className="font-heading font-semibold text-2xl text-foreground-hi">
          {m.treasury_title()}
        </h1>
        <p className="mt-1 max-w-[62ch] text-pretty text-muted-foreground-3 text-sm">
          {m.treasury_intro()}
        </p>
      </div>

      {balance === null || transferable === null ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{m.treasury_empty_title()}</EmptyTitle>
            <EmptyDescription>{m.treasury_empty_body()}</EmptyDescription>
          </EmptyHeader>
          <Button render={<Link to="/bank-account" />} size="xl">
            {m.treasury_empty_cta()}
          </Button>
        </Empty>
      ) : (
        <>
          <TreasuryHero
            balance={balance}
            onRecord={onRecord}
            pendingTransfers={data.pendingTransfers}
            transferable={transferable}
          />
          <TreasuryBreakdown data={data} />
        </>
      )}

      <PastTransfersCard
        transfers={data.transfers}
        deletingTransferId={deletingTransferId}
        onDelete={onDeleteTransfer}
      />
    </div>
  );
}
