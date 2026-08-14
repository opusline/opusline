import type {
  CraCountsData,
  CraDetailData,
  CraListItemData,
  SettingsData,
} from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useMemo, useState } from "react";
import { useLocale } from "@/components/money-format-provider";
import { buildCraGrid, fillWeekdays, withDay } from "../lib/cra-grid";
import { craItemKey } from "../lib/cra-picker";
import { CRA_STEPS, type CraStep, panelsFor } from "../lib/cra-steps";
import { CraDocument } from "./cra-document";
import { CraEmptyState } from "./cra-empty-state";
import { CraGuidedFooter } from "./cra-guided-footer";
import { CraHeader } from "./cra-header";
import { CraMonthGrid } from "./cra-month-grid";
import { CraPicker } from "./cra-picker";
import { CraReviewPanel } from "./cra-review-panel";
import { CraSignedReturnDialog } from "./cra-signed-return-dialog";
import { CraStatTiles } from "./cra-stat-tiles";
import { CraStepTracker } from "./cra-step-tracker";

type CraPageProps = {
  items: CraListItemData[];
  counts: CraCountsData;
  detail: CraDetailData | null;
  settings: SettingsData;
  issuerFallbackName: string;
  signatureSrc: string;
  step: CraStep;
  isDetailPending: boolean;
  isBusy: boolean;
  isSignedReturnOpen: boolean;
  error: string | null;
  uploadError: string | null;
  pendingDates?: Set<string>;
  onSignedReturnOpenChange: (open: boolean) => void;
  onPick: (item: CraListItemData) => void;
  onStepChange: (step: CraStep) => void;
  onDaysChange: (
    days: { date: string; dayFractionBp: number }[],
    touched?: string[],
  ) => void;
  onReset: () => void;
  onSend: (applySignature: boolean) => void;
  onReopen: () => void;
  onUploadSignedReturn: (file: File) => void;
  onDownload: (applySignature: boolean) => void;
  onGoToClients: () => void;
  onOpenSignatureSettings: () => void;
};

export function CraPage({
  items,
  counts,
  detail,
  settings,
  issuerFallbackName,
  signatureSrc,
  step,
  isDetailPending,
  isBusy,
  isSignedReturnOpen,
  error,
  uploadError,
  pendingDates,
  onSignedReturnOpenChange,
  onPick,
  onStepChange,
  onDaysChange,
  onReset,
  onSend,
  onReopen,
  onUploadSignedReturn,
  onDownload,
  onGoToClients,
  onOpenSignatureSettings,
}: CraPageProps) {
  const [query, setQuery] = useState("");
  // Defaults on when a signature exists: someone who took the trouble to save one
  // wants it on the document.
  const [applySignature, setApplySignature] = useState(settings.hasSignature);

  const selectedKey =
    detail === null
      ? null
      : craItemKey({
          missionId: detail.cra.missionId,
          month: detail.cra.month,
        });

  return (
    <div className="flex flex-col gap-5">
      {error !== null && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {items.length > 0 && (
          <CraPicker
            counts={counts}
            items={items}
            onPick={onPick}
            onQueryChange={setQuery}
            query={query}
            selectedKey={selectedKey}
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {items.length === 0 && (
            <CraEmptyState onGoToClients={onGoToClients} />
          )}

          {isDetailPending && (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-10 w-72" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-80 w-full" />
            </div>
          )}

          {detail !== null && !isDetailPending && (
            <CraDetail
              applySignature={applySignature}
              detail={detail}
              isBusy={isBusy}
              onDaysChange={onDaysChange}
              onDownload={() => onDownload(applySignature)}
              onOpenSignatureSettings={onOpenSignatureSettings}
              onReopen={onReopen}
              onReset={onReset}
              onSend={() => onSend(applySignature)}
              onSignedReturn={() => onSignedReturnOpenChange(true)}
              onStepChange={onStepChange}
              onToggleSignature={setApplySignature}
              pendingDates={pendingDates}
              issuerFallbackName={issuerFallbackName}
              settings={settings}
              signatureSrc={signatureSrc}
              step={step}
            />
          )}
        </div>
      </div>

      {detail !== null && (
        <CraSignedReturnDialog
          detail={detail}
          error={uploadError}
          isPending={isBusy}
          onOpenChange={onSignedReturnOpenChange}
          onUpload={onUploadSignedReturn}
          open={isSignedReturnOpen}
        />
      )}
    </div>
  );
}

type CraDetailProps = {
  detail: CraDetailData;
  settings: SettingsData;
  issuerFallbackName: string;
  signatureSrc: string;
  step: CraStep;
  isBusy: boolean;
  applySignature: boolean;
  pendingDates?: Set<string>;
  onStepChange: (step: CraStep) => void;
  onDaysChange: (
    days: { date: string; dayFractionBp: number }[],
    touched?: string[],
  ) => void;
  onReset: () => void;
  onSend: () => void;
  onReopen: () => void;
  onSignedReturn: () => void;
  onDownload: () => void;
  onToggleSignature: (applySignature: boolean) => void;
  onOpenSignatureSettings: () => void;
};

function CraDetail({
  detail,
  settings,
  issuerFallbackName,
  signatureSrc,
  step,
  isBusy,
  applySignature,
  pendingDates,
  onStepChange,
  onDaysChange,
  onReset,
  onSend,
  onReopen,
  onSignedReturn,
  onDownload,
  onToggleSignature,
  onOpenSignatureSettings,
}: CraDetailProps) {
  const { cra } = detail;
  const locale = useLocale();
  // One derivation for the grid, the tiles and the document — and memoized, so typing in
  // the picker's search box does not rebuild the month.
  const model = useMemo(
    () => buildCraGrid({ locale, month: cra.month, days: cra.days }),
    [locale, cra.month, cra.days],
  );
  const panels = panelsFor(step, cra);

  return (
    <>
      <CraHeader
        detail={detail}
        isBusy={isBusy}
        onDownload={onDownload}
        onReopen={onReopen}
        onSignedReturn={onSignedReturn}
      />

      {cra.editable && (
        <CraStepTracker cra={cra} current={step} onGo={onStepChange} />
      )}

      <CraStatTiles cra={cra} offDaysWorked={model.offDaysWorked} />

      <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
        {panels.grid && (
          <CraMonthGrid
            editable={cra.editable}
            isDirty={cra.dirty}
            model={model}
            onChange={(date, dayFractionBp) =>
              onDaysChange(withDay(model, date, dayFractionBp), [date])
            }
            onFillWeekdays={() => onDaysChange(fillWeekdays(model))}
            onReset={onReset}
            pendingDates={pendingDates}
            reportedDays={cra.totalDays}
            trackedDays={cra.trackedDays}
          />
        )}

        {panels.review && (
          <CraReviewPanel detail={detail} settings={settings} />
        )}

        {panels.document && (
          <CraDocument
            applySignature={applySignature}
            detail={detail}
            model={model}
            onApplySignatureChange={onToggleSignature}
            issuerFallbackName={issuerFallbackName}
            onOpenSignatureSettings={onOpenSignatureSettings}
            settings={settings}
            signatureSrc={signatureSrc}
          />
        )}
      </div>

      {cra.editable && (
        <CraGuidedFooter
          isBusy={isBusy}
          onAdvance={() =>
            step === "document"
              ? onSend()
              : onStepChange(CRA_STEPS[CRA_STEPS.indexOf(step) + 1])
          }
          onBack={() => onStepChange(CRA_STEPS[CRA_STEPS.indexOf(step) - 1])}
          onDownload={onDownload}
          step={step}
        />
      )}
    </>
  );
}
