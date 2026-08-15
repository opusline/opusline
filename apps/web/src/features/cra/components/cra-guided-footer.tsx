import { Button } from "@opusline/ui/components/button";
import { DownloadIcon } from "lucide-react";

import { m } from "@/paraglide/messages.js";

import { CRA_STEP_ACTIONS, CRA_STEPS, type CraStep } from "../lib/cra-steps";

type CraGuidedFooterProps = {
  step: CraStep;
  isBusy: boolean;
  onAdvance: () => void;
  onBack: () => void;
  onDownload: () => void;
};

const STEP_HINTS: Record<CraStep, () => string> = {
  days: m.cra_grid_footer_hint,
  review: m.cra_hint_review,
  document: m.cra_hint_document,
};

/**
 * The draft's own action bar.
 *
 * A CRA in progress is a short guided flow, so the thing to do next sits at the foot
 * of the page where the eye lands after reading the grid — not in a header the user
 * scrolled past.
 */
export function CraGuidedFooter({
  step,
  isBusy,
  onAdvance,
  onBack,
  onDownload,
}: CraGuidedFooterProps) {
  const index = CRA_STEPS.indexOf(step);

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {index > 0 && (
        <Button disabled={isBusy} onClick={onBack} size="2xl" variant="outline">
          {m.week_back()}
        </Button>
      )}

      <span className="text-muted-foreground-3 text-sm">
        {STEP_HINTS[step]()}
      </span>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        {step === "document" && (
          <Button
            disabled={isBusy}
            onClick={onDownload}
            size="2xl"
            variant="outline"
          >
            <DownloadIcon aria-hidden data-icon="inline-start" />
            {m.cra_download_pdf()}
          </Button>
        )}
        <Button disabled={isBusy} onClick={onAdvance} size="2xl">
          {CRA_STEP_ACTIONS[step]()}
        </Button>
      </div>
    </div>
  );
}
