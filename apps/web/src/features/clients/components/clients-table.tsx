import type { ClientWithMissionsData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@opusline/ui/components/table";
import { cn } from "@opusline/ui/lib/utils";
import { Fragment } from "react";

import {
  CLIENT_TYPE_BADGE_VARIANTS,
  CLIENT_TYPE_LABELS,
  COLOR_CLASSES,
  clientSubtitle,
  formatMissionRate,
  MISSION_STATUS_BADGE_VARIANTS,
  MISSION_STATUS_LABELS,
} from "../lib/labels";
import { ClientsEmptyState } from "./clients-empty-state";

type ClientsTableProps = {
  clients: ClientWithMissionsData[];
};

export function ClientsTable({ clients }: ClientsTableProps) {
  if (clients.length === 0) {
    return <ClientsEmptyState />;
  }

  const currentYear = new Date().getFullYear();

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Missions</TableHead>
            <TableHead className="text-right">CA {currentYear}</TableHead>
            <TableHead className="text-right">En attente</TableHead>
            <TableHead className="text-right">Délai moyen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => {
            const subtitle = clientSubtitle(client);

            return (
              <Fragment key={client.id}>
                <TableRow>
                  <TableCell>
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="flex items-center gap-2 font-medium text-card-foreground">
                        <span
                          aria-hidden
                          className={cn(
                            "size-2 shrink-0 rounded-[2px]",
                            COLOR_CLASSES[client.color],
                          )}
                        />
                        {client.name}
                      </span>
                      {subtitle !== "" && (
                        <span className="pl-4 text-muted-foreground text-xs">
                          {subtitle}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={CLIENT_TYPE_BADGE_VARIANTS[client.type]}>
                      {CLIENT_TYPE_LABELS[client.type]}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono tabular-nums">
                    {client.missions.length}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    —
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    —
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    —
                  </TableCell>
                </TableRow>
                {client.missions.map((mission) => (
                  <TableRow key={mission.id} className="bg-muted/30">
                    <TableCell>
                      <div className="flex min-w-0 items-center gap-2 pl-4">
                        <span
                          aria-hidden
                          className={cn(
                            "h-3.5 w-0.5 shrink-0 rounded-full",
                            COLOR_CLASSES[mission.color ?? client.color],
                          )}
                        />
                        <span className="truncate text-muted-foreground text-sm">
                          {mission.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {formatMissionRate(mission)}
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground tabular-nums">
                      —
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      —
                    </TableCell>
                    <TableCell />
                    <TableCell className="text-right">
                      <Badge
                        variant={MISSION_STATUS_BADGE_VARIANTS[mission.status]}
                      >
                        {MISSION_STATUS_LABELS[mission.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {client.missions.length === 0 && (
                  <TableRow className="bg-muted/30">
                    <TableCell
                      colSpan={6}
                      className="pl-8 text-muted-foreground text-xs"
                    >
                      Aucune mission
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
