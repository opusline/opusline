import type {
  DeclarationCompletionData,
  DeclarationsData,
} from "@opusline/api-client";
import { cn } from "@opusline/ui/lib/utils";

import { m } from "@/paraglide/messages.js";

import type { DeclarationKind } from "../lib/labels";
import { CaCumulativeCard } from "./ca-cumulative-card";
import { DeclarationsHeader } from "./declarations-header";
import { DeclarationsHistoryCard } from "./declarations-history-card";
import { UrssafDeclarationCard } from "./urssaf-declaration-card";
import { VatDeclarationCard } from "./vat-declaration-card";

export type DeclarationTarget = { kind: DeclarationKind; periodKey: string };

type DeclarationsPageProps = {
  data: DeclarationsData;
  isRefreshing: boolean;
  /** The completion a write is in flight for. */
  pendingTarget: DeclarationTarget | null;
  onPeriodChange: (period: string) => void;
  onMarkFiled: (target: DeclarationTarget) => void;
  onMarkPaid: (target: DeclarationTarget) => void;
  onUnmark: (target: DeclarationTarget) => void;
  onClearPayment: (target: DeclarationTarget) => void;
};

export function DeclarationsPage({
  data,
  isRefreshing,
  pendingTarget,
  onPeriodChange,
  onMarkFiled,
  onMarkPaid,
  onUnmark,
  onClearPayment,
}: DeclarationsPageProps) {
  const { urssaf, vat, cumulative, history } = data;
  const isPending = (target: DeclarationTarget) =>
    pendingTarget !== null &&
    pendingTarget.kind === target.kind &&
    pendingTarget.periodKey === target.periodKey;
  // « Annuler » walks the completion back one step: the payment first.
  const undo = (
    target: DeclarationTarget,
    completion: DeclarationCompletionData,
  ) => (completion.paidOn === null ? onUnmark(target) : onClearPayment(target));
  // The API builds a zero URSSAF card for any month, deadline-less before the
  // business existed: that is the state with nothing to file.
  const isBeforeStart =
    urssaf !== null &&
    urssaf.deadline === null &&
    (vat === null || vat.deadline === null);

  return (
    <div
      aria-busy={isRefreshing || undefined}
      className={cn(
        "mx-auto flex w-full max-w-6xl flex-col gap-4 transition-opacity",
        isRefreshing && "opacity-60",
      )}
    >
      <DeclarationsHeader
        nextPeriod={data.nextPeriod}
        onPeriodChange={onPeriodChange}
        period={data.period}
        previousPeriod={data.previousPeriod}
      />

      {isBeforeStart ? (
        <p className="rounded-md border bg-card px-5 py-7 text-center text-muted-foreground-3 text-sm">
          {m.declarations_before_start()}
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(22rem,1fr))] items-stretch gap-4">
          <div className="flex flex-col gap-4">
            {urssaf !== null && (
              <UrssafDeclarationCard
                isBusy={isPending({ kind: 0, periodKey: urssaf.period })}
                onMarkFiled={() =>
                  onMarkFiled({ kind: 0, periodKey: urssaf.period })
                }
                onMarkPaid={() =>
                  onMarkPaid({ kind: 0, periodKey: urssaf.period })
                }
                onUndo={(completion) =>
                  undo({ kind: 0, periodKey: urssaf.period }, completion)
                }
                urssaf={urssaf}
              />
            )}
            {cumulative !== null && (
              <CaCumulativeCard cumulative={cumulative} />
            )}
          </div>
          {vat !== null && (
            <VatDeclarationCard
              isBusy={isPending({ kind: 1, periodKey: vat.period })}
              onMarkFiled={() =>
                onMarkFiled({ kind: 1, periodKey: vat.period })
              }
              onMarkPaid={() => onMarkPaid({ kind: 1, periodKey: vat.period })}
              onUndo={(completion) =>
                undo({ kind: 1, periodKey: vat.period }, completion)
              }
              vat={vat}
            />
          )}
        </div>
      )}

      {history.length > 0 && (
        <DeclarationsHistoryCard history={history} period={data.period} />
      )}
    </div>
  );
}
