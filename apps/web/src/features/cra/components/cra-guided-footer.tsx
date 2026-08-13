import { Button } from "@opusline/ui/components/button";
import { DownloadIcon } from "lucide-react";

import { CRA_STEP_ACTIONS, CRA_STEPS, type CraStep } from "../lib/cra-steps";
import { GRID_FOOTER_HINT } from "../lib/labels";

type CraGuidedFooterProps = {
  step: CraStep;
  isBusy: boolean;
  onAdvance: () => void;
  onBack: () => void;
  onDownload: () => void;
};

const STEP_HINTS: Record<CraStep, string> = {
  days: GRID_FOOTER_HINT,
  review: "Vérifiez avant d'envoyer",
  document: "Le document part tel quel",
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
          Retour
        </Button>
      )}

      <span className="text-muted-foreground-3 text-sm">
        {STEP_HINTS[step]}
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
            Télécharger le PDF
          </Button>
        )}
        <Button disabled={isBusy} onClick={onAdvance} size="2xl">
          {CRA_STEP_ACTIONS[step]}
        </Button>
      </div>
    </div>
  );
}
