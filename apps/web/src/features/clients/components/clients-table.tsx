import type {
  ClientRevenueListData,
  ClientWithMissionsData,
} from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { Chip, ChipCount, ChipGroup } from "@opusline/ui/components/chip";
import { eyebrowVariants } from "@opusline/ui/components/eyebrow";
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
import { useMemo, useState } from "react";
import { BudgetShareBadge } from "@/components/budget-share-badge";
import { MissionStatusBadge } from "@/components/mission-status-badge";
import { useMoneyFormat } from "@/components/money-format-provider";
import { formatMissionRate } from "@/lib/billing";
import {
  formatPaymentDelay,
  formatRevenue,
  indexClientRevenue,
  indexMissionRevenue,
  revenueYearLabel,
} from "@/lib/client-revenue";
import { clientTypeLabel } from "@/lib/client-types";
import { COLOR_CLASSES } from "@/lib/palette";

import { m } from "@/paraglide/messages.js";

import {
  CLIENT_TYPE_BADGE_VARIANTS,
  clientSubtitle,
  isNewClient,
} from "../lib/labels";
import { ClientsEmptyState } from "./clients-empty-state";

const CLIENT_SCOPES = ["active", "archived", "all"] as const;

type ClientScope = (typeof CLIENT_SCOPES)[number];

const CLIENT_SCOPE_MESSAGES: Record<ClientScope, () => string> = {
  all: m.clients_scope_all,
  active: m.clients_scope_active,
  archived: m.clients_scope_archived,
};

function isClientScope(value: unknown): value is ClientScope {
  return (CLIENT_SCOPES as readonly unknown[]).includes(value);
}

type ClientsTableProps = {
  clients: ClientWithMissionsData[];
  /** Undefined while the figures are still loading; cells show a placeholder. */
  revenue?: ClientRevenueListData;
};

export function ClientsTable({ clients, revenue }: ClientsTableProps) {
  const format = useMoneyFormat();
  const navigate = useNavigate();
  const [scope, setScope] = useState<ClientScope>("active");
  const revenueByClient = useMemo(() => indexClientRevenue(revenue), [revenue]);
  const revenueByMission = useMemo(
    () => indexMissionRevenue(revenue?.clients),
    [revenue],
  );

  if (clients.length === 0) {
    return <ClientsEmptyState />;
  }

  const now = new Date();

  const scopedClients: Record<ClientScope, ClientWithMissionsData[]> = {
    all: clients,
    active: clients.filter((client) => client.archivedAt === null),
    archived: clients.filter((client) => client.archivedAt !== null),
  };
  const visibleClients = scopedClients[scope];

  return (
    <div className="flex flex-col gap-3">
      <ChipGroup
        aria-label={m.clients_filter_aria()}
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
            aria-label={`${CLIENT_SCOPE_MESSAGES[clientScope]()} (${scopedClients[clientScope].length})`}
          >
            {CLIENT_SCOPE_MESSAGES[clientScope]()}
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
              <TableHead className={cn(eyebrowVariants(), "w-1/4 py-3 pl-5")}>
                {m.clients_head_client()}
              </TableHead>
              <TableHead className={cn(eyebrowVariants(), "w-3/16")}>
                {m.clients_head_type()}
              </TableHead>
              <TableHead className={cn(eyebrowVariants(), "w-1/9")}>
                {m.clients_missions_title()}
              </TableHead>
              <TableHead className={cn(eyebrowVariants(), "w-1/6 text-right")}>
                {revenueYearLabel(revenue?.year)}
              </TableHead>
              <TableHead className={cn(eyebrowVariants(), "w-1/6 text-right")}>
                {m.clients_head_pending()}
              </TableHead>
              <TableHead
                className={cn(eyebrowVariants(), "py-3 pr-5 text-right")}
              >
                {m.clients_head_average_delay()}
              </TableHead>
            </TableRow>
          </TableHeader>
          {visibleClients.map((client) => {
            const subtitle = clientSubtitle(client);
            const isArchived = client.archivedAt !== null;
            const clientRevenue = revenueByClient.get(client.id);

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
                          <Badge variant="brand">{m.clients_badge_new()}</Badge>
                        )}
                        {isArchived && (
                          <Badge variant="quiet">
                            {m.clients_badge_archived()}
                          </Badge>
                        )}
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
                      {clientTypeLabel(client.type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 font-mono text-foreground-4 tabular-nums">
                    {client.missions.length}
                  </TableCell>
                  <TableCell className="py-4 text-right font-mono tabular-nums">
                    {formatRevenue(format, clientRevenue?.yearToDate)}
                  </TableCell>
                  <TableCell className="py-4 text-right font-mono text-muted-foreground tabular-nums">
                    {formatRevenue(format, clientRevenue?.pending)}
                  </TableCell>
                  <TableCell className="py-4 pr-5 text-right font-mono text-muted-foreground-3 tabular-nums">
                    {formatPaymentDelay(clientRevenue?.averagePaymentDelayDays)}
                  </TableCell>
                </TableRow>
                {client.missions.map((mission) => {
                  const missionRevenue = revenueByMission.get(mission.id);
                  const budget = missionRevenue?.fixedPrice ?? null;

                  return (
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
                        {formatRevenue(format, missionRevenue?.yearToDate)}
                      </TableCell>
                      <TableCell className="py-2.5 text-right">
                        {budget === null ? null : (
                          <BudgetShareBadge budget={budget} />
                        )}
                      </TableCell>
                      <TableCell className="py-2.5 pr-5 text-right">
                        <MissionStatusBadge
                          clientType={client.type}
                          status={mission.status}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
                {isArchived ? (
                  <TableRow className="bg-muted hover:bg-muted">
                    <TableCell
                      colSpan={6}
                      className="border-accent border-t py-2.5 pr-5 pl-8.5 text-muted-foreground-3 text-sm"
                    >
                      {m.clients_archived_row_note()}
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
                          ? m.clients_no_mission_create()
                          : m.clients_add_mission()}
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
            {m.clients_empty_scope()}
          </div>
        )}
      </div>
    </div>
  );
}
