import type { CraDetailData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { Button } from "@opusline/ui/components/button";
import { DownloadIcon } from "lucide-react";

import { craStatusBadge } from "@/lib/cra-status";
import { monthTitle } from "@/lib/months";

import { craSubtitle } from "../lib/labels";

type CraHeaderProps = {
  detail: CraDetailData;
  isBusy: boolean;
  onReopen: () => void;
  onSignedReturn: () => void;
  onDownload: () => void;
};

/**
 * The month, where it stands, and the one thing to do about it.
 *
 * Which action is primary follows the status rather than the step: a draft is waiting
 * to go out, a sent CRA is waiting to come back, and a signed one is done.
 */
export function CraHeader({
  detail,
  isBusy,
  onReopen,
  onSignedReturn,
  onDownload,
}: CraHeaderProps) {
  const { cra, client, mission } = detail;
  const badge = craStatusBadge(cra.status);

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="font-heading font-semibold text-2xl text-foreground-hi leading-tight">
            {monthTitle(cra.month)}
          </h1>
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>
        <p className="mt-1.5 text-muted-foreground-3 text-sm">
          {craSubtitle(client.name, client.type === 1, mission.name, cra.dirty)}
        </p>
      </div>

      {/* A draft's actions live in the guided footer, where the design puts them, so
          the header stays out of the way until the CRA has been issued. */}
      <div className="flex flex-wrap items-center gap-2">
        {cra.status !== 0 && (
          <Button
            disabled={isBusy}
            onClick={onDownload}
            size="xl"
            variant="outline"
          >
            <DownloadIcon aria-hidden data-icon="inline-start" />
            Télécharger le PDF
          </Button>
        )}

        {cra.status === 1 && (
          <>
            <Button
              disabled={isBusy}
              onClick={onReopen}
              size="xl"
              variant="ghost"
            >
              Rouvrir
            </Button>
            <Button disabled={isBusy} onClick={onSignedReturn} size="xl">
              Enregistrer le retour signé
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
