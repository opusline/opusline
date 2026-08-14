import type { ClientWithMissionsData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { Chip, ChipCount, ChipGroup } from "@opusline/ui/components/chip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@opusline/ui/components/table";
import { cn } from "@opusline/ui/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { MissionStatusBadge } from "@/components/mission-status-badge";
import { useMoneyFormat } from "@/components/money-format-provider";
import { formatMissionRate } from "@/lib/billing";
import { CLIENT_TYPE_LABELS } from "@/lib/client-types";
import { COLOR_CLASSES } from "@/lib/palette";

import {
  CLIENT_TYPE_BADGE_VARIANTS,
  clientSubtitle,
  isNewClient,
} from "../lib/labels";
import { ClientsEmptyState } from "./clients-empty-state";

const HEAD_CLASSES =
  "font-medium text-muted-foreground-2 text-xs uppercase tracking-widest";

const CLIENT_SCOPES = ["active", "archived", "all"] as const;

type ClientScope = (typeof CLIENT_SCOPES)[number];

const CLIENT_SCOPE_LABELS: Record<ClientScope, string> = {
  all: "Tous",
  active: "Actifs",
  archived: "Archivés",
};

function isClientScope(value: unknown): value is ClientScope {
  return (CLIENT_SCOPES as readonly unknown[]).includes(value);
}

type ClientsTableProps = {
  clients: ClientWithMissionsData[];
};

export function ClientsTable({ clients }: ClientsTableProps) {
  const format = useMoneyFormat();
  const navigate = useNavigate();
  const [scope, setScope] = useState<ClientScope>("active");

  if (clients.length === 0) {
    return <ClientsEmptyState />;
  }

  const now = new Date();
  const currentYear = now.getFullYear();

  const scopedClients: Record<ClientScope, ClientWithMissionsData[]> = {
    all: clients,
    active: clients.filter((client) => client.archivedAt === null),
    archived: clients.filter((client) => client.archivedAt !== null),
  };
  const visibleClients = scopedClients[scope];

  return (
    <div className="flex flex-col gap-3">
      <ChipGroup
        aria-label="Filtrer les clients"
        value={[scope]}
        onValueChange={(value) => {
          const nextScope = value.find(isClientScope);

          if (nextScope !== undefined) {
            setScope(nextScope);
          }
        }}
      >
        {CLIENT_SCOPES.map((clientScope) => (
          <Chip
            key={clientScope}
            value={clientScope}
            shape="pill"
            aria-label={`${CLIENT_SCOPE_LABELS[clientScope]} (${scopedClients[clientScope].length})`}
          >
            {CLIENT_SCOPE_LABELS[clientScope]}
            <ChipCount aria-hidden>
              {scopedClients[clientScope].length}
            </ChipCount>
          </Chip>
        ))}
      </ChipGroup>
      <div className="overflow-hidden rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={cn(HEAD_CLASSES, "w-1/4 py-3 pl-5")}>
                Client
              </TableHead>
              <TableHead className={cn(HEAD_CLASSES, "w-3/16")}>Type</TableHead>
              <TableHead className={cn(HEAD_CLASSES, "w-1/9")}>
                Missions
              </TableHead>
              <TableHead className={cn(HEAD_CLASSES, "w-1/6 text-right")}>
                CA {currentYear}
              </TableHead>
              <TableHead className={cn(HEAD_CLASSES, "w-1/6 text-right")}>
                En attente
              </TableHead>
              <TableHead className={cn(HEAD_CLASSES, "py-3 pr-5 text-right")}>
                Délai moyen
              </TableHead>
            </TableRow>
          </TableHeader>
          {visibleClients.map((client) => {
            const subtitle = clientSubtitle(client);
            const isArchived = client.archivedAt !== null;

            return (
              <TableBody
                key={client.id}
                className="group/client border-secondary border-b last:border-0"
              >
                <TableRow
                  className={cn(
                    "cursor-pointer border-secondary hover:bg-accent",
                    isArchived && "opacity-60",
                  )}
                  onClick={() =>
                    void navigate({
                      to: "/clients/$clientSlug",
                      params: { clientSlug: client.slug },
                    })
                  }
                >
                  <TableCell className="py-4 pl-5">
                    <div className="flex min-w-0 flex-col gap-0.75">
                      <span className="flex min-w-0 items-center gap-2.5">
                        <span
                          aria-hidden
                          className={cn(
                            "size-2.5 shrink-0 rounded-sm",
                            COLOR_CLASSES[client.color],
                          )}
                        />
                        <Link
                          className="truncate font-medium text-foreground-hi text-sm"
                          onClick={(event) => event.stopPropagation()}
                          params={{ clientSlug: client.slug }}
                          to="/clients/$clientSlug"
                        >
                          {client.name}
                        </Link>
                        {!isArchived && isNewClient(client, now) && (
                          <Badge variant="brand">Nouveau</Badge>
                        )}
                        {isArchived && <Badge variant="quiet">Archivé</Badge>}
                      </span>
                      {subtitle !== "" && (
                        <span className="pl-5 text-muted-foreground-2 text-xs">
                          {subtitle}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="min-w-0 py-4 pr-3">
                    <Badge variant={CLIENT_TYPE_BADGE_VARIANTS[client.type]}>
                      {CLIENT_TYPE_LABELS[client.type]}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 font-mono text-foreground-4 tabular-nums">
                    {client.missions.length}
                  </TableCell>
                  <TableCell className="py-4 text-right font-mono tabular-nums">
                    —
                  </TableCell>
                  <TableCell className="py-4 text-right font-mono text-muted-foreground tabular-nums">
                    —
                  </TableCell>
                  <TableCell className="py-4 pr-5 text-right font-mono text-muted-foreground-3 tabular-nums">
                    —
                  </TableCell>
                </TableRow>
                {client.missions.map((mission) => (
                  <TableRow
                    key={mission.id}
                    className="cursor-pointer border-secondary bg-muted hover:bg-card-2"
                    onClick={() =>
                      void navigate({
                        to: "/clients/$clientSlug/missions/$missionSlug",
                        params: {
                          clientSlug: client.slug,
                          missionSlug: mission.slug,
                        },
                      })
                    }
                  >
                    <TableCell className="py-2.5 pl-5">
                      <div className="flex min-w-0 items-center gap-2.5 pl-3.5">
                        <span
                          aria-hidden
                          className={cn(
                            "h-3 w-0.75 shrink-0 rounded-sm",
                            COLOR_CLASSES[mission.color ?? client.color],
                          )}
                        />
                        <Link
                          className="truncate text-sm text-foreground-3"
                          onClick={(event) => event.stopPropagation()}
                          params={{
                            clientSlug: client.slug,
                            missionSlug: mission.slug,
                          }}
                          to="/clients/$clientSlug/missions/$missionSlug"
                        >
                          {mission.name}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5 text-muted-foreground-2 text-xs">
                      {formatMissionRate(format, mission)}
                    </TableCell>
                    <TableCell className="py-2.5 font-mono text-muted-foreground-3 tabular-nums">
                      —
                    </TableCell>
                    <TableCell className="py-2.5 text-right font-mono text-foreground-3 tabular-nums">
                      —
                    </TableCell>
                    <TableCell />
                    <TableCell className="py-2.5 pr-5 text-right">
                      <MissionStatusBadge
                        clientType={client.type}
                        status={mission.status}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {isArchived ? (
                  <TableRow className="bg-muted hover:bg-muted">
                    <TableCell
                      colSpan={6}
                      className="border-accent border-t py-2.5 pr-5 pl-8.5 text-muted-foreground-3 text-sm"
                    >
                      Client archivé — réactivez-le pour ajouter une mission.
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow className="group/add bg-muted hover:bg-card-2">
                    <TableCell colSpan={6} className="p-0">
                      <button
                        type="button"
                        onClick={() =>
                          void navigate({
                            to: "/missions/new",
                            search: { client: client.slug },
                          })
                        }
                        className={cn(
                          "flex w-full items-center gap-2 pl-8.5 font-normal text-muted-foreground text-sm transition-all group-hover/add:text-primary-note focus-visible:text-primary-note",
                          client.missions.length > 0
                            ? "py-2 opacity-0 pointer-coarse:opacity-100 focus-visible:opacity-100 group-hover/client:opacity-100"
                            : "py-3.25",
                        )}
                      >
                        <PlusIcon
                          aria-hidden
                          className="size-3.25"
                          strokeWidth={2.2}
                        />
                        {client.missions.length === 0
                          ? "Aucune mission — en créer une"
                          : "Ajouter une mission"}
                      </button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            );
          })}
        </Table>
        {visibleClients.length === 0 && (
          <div className="px-5 py-6 text-center text-muted-foreground-3 text-sm">
            Aucun client dans cette vue.
          </div>
        )}
      </div>
    </div>
  );
}
