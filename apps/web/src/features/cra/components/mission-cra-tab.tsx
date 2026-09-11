import type { CraListItemData } from "@opusline/api-client";
import { listCrasOptions } from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Badge } from "@opusline/ui/components/badge";
import { Button } from "@opusline/ui/components/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@opusline/ui/components/empty";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { ChevronRightIcon } from "lucide-react";

import { useLocale } from "@/components/money-format-provider";
import { craStatusBadge } from "@/lib/cra-status";
import { monthTitle } from "@/lib/months";
import { m } from "@/paraglide/messages.js";
import { reportedAgainstTrackedLabel } from "../lib/labels";

type MissionCraTabProps = {
  missionId: number;
  /** Opens the month on the CRA screen; a month still owed has no row to open yet. */
  onOpen: (row: CraListItemData) => void;
  onOpenAll: () => void;
};

/**
 * The CRA tab of a mission fiche: every month this mission owes or has already
 * reported, newest first.
 *
 * It fetches rather than taking rows as props because the tab panel only mounts once
 * opened — a fiche visit that never leaves the first tab costs no request.
 */
export function MissionCraTab({
  missionId,
  onOpen,
  onOpenAll,
}: MissionCraTabProps) {
  const locale = useLocale();
  const cras = useQuery(listCrasOptions());

  if (cras.isPending) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (cras.isError || cras.data === undefined) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{m.cra_error_load()}</AlertDescription>
      </Alert>
    );
  }

  // GET /cras takes no mission filter and answers with every mission's months.
  const rows = cras.data.cras.filter((item) => item.missionId === missionId);

  if (rows.length === 0) {
    return (
      <Empty className="px-7 py-9">
        <EmptyHeader className="max-w-none gap-2">
          <EmptyTitle variant="strong">{m.missions_cra_title()}</EmptyTitle>
          <EmptyDescription className="max-w-md text-pretty text-muted-foreground-3 text-sm leading-relaxed">
            {m.missions_cra_none()}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-3.5">
      <ul className="divide-y divide-border overflow-hidden rounded-md border bg-card">
        {rows.map((row) => {
          const badge =
            row.id === null
              ? { variant: "quiet" as const, label: m.cra_group_to_produce() }
              : craStatusBadge(row.status);

          return (
            <li key={`${row.missionId}:${row.month}`}>
              <button
                className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                onClick={() => onOpen(row)}
                type="button"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-foreground-hi text-sm">
                    {monthTitle(locale, row.month)}
                  </span>
                  <span className="mt-0.75 block truncate text-muted-foreground-3 text-xs">
                    {reportedAgainstTrackedLabel(
                      locale,
                      row.totalDays,
                      row.trackedDays,
                    )}
                  </span>
                </span>
                <Badge variant={badge.variant}>{badge.label}</Badge>
                <ChevronRightIcon
                  aria-hidden
                  className="size-4 shrink-0 text-muted-foreground-4"
                />
              </button>
            </li>
          );
        })}
      </ul>

      <div>
        <Button onClick={onOpenAll} variant="outline">
          {m.missions_open_cras()}
        </Button>
      </div>
    </div>
  );
}
