import type { TreasuryData } from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Badge } from "@opusline/ui/components/badge";
import { Button } from "@opusline/ui/components/button";
import { cn } from "@opusline/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { CircleAlert } from "lucide-react";
import { useState } from "react";

import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { formatAmountWithCents, formatWholeAmount } from "@/lib/billing";
import { calendarDateNumericLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

import { treasuryBands } from "../lib/bands";
import {
  RecordTransferDialog,
  type RecordTransferSubmit,
} from "./record-transfer-dialog";

const EYEBROW_CLASSES =
  "font-medium text-muted-foreground-2 text-xs uppercase tracking-widest";

type TreasuryPageProps = {
  treasury: TreasuryData;
  /** `Y-m-d`, passed in rather than read from the clock so stories stay fixed. */
  today: string;
  isSaving?: boolean;
  saveError?: string | null;
  onRecordTransfer: (input: RecordTransferSubmit) => void;
};

export function TreasuryPage({
  treasury,
  today,
  isSaving = false,
  saveError = null,
  onRecordTransfer,
}: TreasuryPageProps) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();
  const [isRecording, setIsRecording] = useState(false);

  const bands = treasuryBands(treasury);
  const hasBalance = treasury.balance !== null;

  return (
    <div className="flex max-w-270 flex-col gap-5">
      <div>
        <h1 className="font-heading font-semibold text-2xl text-foreground-hi">
          {m.treasury_question()}
        </h1>
        <p className="mt-1.5 text-muted-foreground-3 text-sm">
          {m.treasury_subtitle()}
        </p>
      </div>

      <div className="rounded-md border border-primary/30 bg-primary/8 p-5">
        <div className={EYEBROW_CLASSES}>{m.treasury_transferable_label()}</div>
        <div className="mt-2 font-mono text-3xl text-primary-text tabular-nums">
          {formatAmountWithCents(format, treasury.transferable.amount)}
        </div>
        <p className="mt-1.5 text-muted-foreground-3 text-sm">
          {hasBalance && treasury.balance !== null
            ? m.treasury_on_balance({
                balance: formatWholeAmount(
                  format,
                  treasury.balance.amount.amount,
                ),
              })
            : m.treasury_no_balance()}
        </p>
        <Button
          className="mt-4"
          onClick={() => setIsRecording(true)}
          size="xl"
          variant="outline"
        >
          {m.treasury_record()}
        </Button>
      </div>

      {treasury.shortfall !== null && (
        <Alert variant="warn">
          <CircleAlert />
          <AlertDescription>
            <strong className="font-medium">{m.treasury_short_title()}</strong>{" "}
            {m.treasury_short_body({
              amount: formatWholeAmount(
                format,
                Math.abs(treasury.shortfall.amount),
              ),
            })}
          </AlertDescription>
        </Alert>
      )}

      {bands.length > 0 && (
        <div className="overflow-hidden rounded-md border bg-card">
          <div
            aria-hidden
            className="flex h-2.5 w-full overflow-hidden border-b"
          >
            {bands.map((band) => (
              <div
                className={band.colorClass}
                key={band.key}
                style={{ width: `${band.shareBp / 100}%` }}
              />
            ))}
          </div>
          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {bands.map((band) => (
              <div className="bg-card p-3.5" key={band.key}>
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className={cn(
                      "size-2.5 shrink-0 rounded-sm",
                      band.colorClass,
                    )}
                  />
                  <span className="text-muted-foreground text-sm">
                    {band.label}
                  </span>
                </div>
                <div className="mt-2 font-mono text-foreground-hi text-lg tabular-nums">
                  {formatWholeAmount(format, band.amountCents)}
                </div>
                {band.sub !== null && (
                  <div className="mt-1 text-muted-foreground-3 text-xs">
                    {band.sub}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-md border bg-card">
        <div className="flex items-center justify-between border-b px-5 py-3.5">
          <span className={EYEBROW_CLASSES}>{m.treasury_past_title()}</span>
          <Link
            className="text-link text-sm transition-colors hover:text-link-hover"
            to="/bank-account"
          >
            {m.treasury_see_account()}
          </Link>
        </div>

        {treasury.transfers.length === 0 ? (
          <div className="px-5 py-6 text-center text-muted-foreground-3 text-sm">
            {m.treasury_none_yet()}
          </div>
        ) : (
          treasury.transfers.map((transfer) => (
            <div
              className="flex items-center gap-3 border-secondary border-b px-5 py-3 last:border-0"
              key={transfer.id}
            >
              <span className="w-24 shrink-0 font-mono text-muted-foreground-3 text-sm tabular-nums">
                {calendarDateNumericLabel(dateFormat, transfer.transferredOn)}
              </span>
              <span className="min-w-0 flex-1 truncate text-foreground-3 text-sm">
                {transfer.note ?? ""}
              </span>
              <Badge variant={transfer.isSettled ? "quiet" : "brand"}>
                {transfer.isSettled
                  ? m.treasury_settled_badge()
                  : m.treasury_pending_badge()}
              </Badge>
              <span className="w-28 shrink-0 text-right font-mono text-foreground-hi text-sm tabular-nums">
                {formatWholeAmount(format, transfer.amount.amount)}
              </span>
            </div>
          ))
        )}
      </div>

      <RecordTransferDialog
        error={saveError}
        isSaving={isSaving}
        onOpenChange={setIsRecording}
        onSubmit={(input) => {
          onRecordTransfer(input);
          setIsRecording(false);
        }}
        open={isRecording}
        today={today}
      />
    </div>
  );
}
