import type {
  ClientWithMissionsData,
  MissionData,
  MissionStatus,
  UpdateMissionData,
} from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@opusline/ui/components/dropdown-menu";
import { StatTile, StatTileRow } from "@opusline/ui/components/stat-tile";
import { Switch } from "@opusline/ui/components/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@opusline/ui/components/tabs";
import { cn } from "@opusline/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  CheckIcon,
  CircleAlert,
  MoreHorizontalIcon,
  PlusIcon,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { MissionStatusBadge } from "@/components/mission-status-badge";
import { useMoneyFormat } from "@/components/money-format-provider";
import { formatAmount, paymentTermsLabel } from "@/lib/billing";
import { clientTypeLabel } from "@/lib/client-types";
import { calendarDateLabel, calendarMonthYearLabel } from "@/lib/dates";
import { entryRoundingLabel } from "@/lib/entry-rounding";
import type { FormSubmitResult } from "@/lib/form";
import { COLOR_CLASSES } from "@/lib/palette";

import { m } from "@/paraglide/messages.js";

import { billingModeUnitShort } from "../lib/labels";
import { MissionEditForm } from "./mission-edit-form";

const EYEBROW_CLASSES =
  "font-medium text-muted-foreground-2 text-xs uppercase tracking-widest";

function FacturationRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-muted-foreground-3 text-sm">{label}</span>
      <span className="text-right text-foreground-2 text-sm">{value}</span>
    </div>
  );
}

type MissionDetailPageProps = {
  mission: MissionData;
  client: ClientWithMissionsData;
  documentsTab: ReactNode;
  onUpdate: (body: UpdateMissionData) => Promise<FormSubmitResult>;
  onSetStatus: (status: MissionStatus) => void;
  onOpenCra: () => void;
  isUpdatePending?: boolean;
  isStatusPending?: boolean;
  error?: string | null;
};

export function MissionDetailPage({
  mission,
  client,
  documentsTab,
  onUpdate,
  onSetStatus,
  onOpenCra,
  isUpdatePending,
  isStatusPending,
  error,
}: MissionDetailPageProps) {
  const format = useMoneyFormat();
  const [isEditing, setIsEditing] = useState(false);

  const barColor = mission.color ?? client.color;
  const isDone = mission.status === 2;
  const isBillable = mission.rate !== null;

  const handleUpdate = async (body: UpdateMissionData) => {
    const result = await onUpdate(body);

    if (result.status === "success") {
      setIsEditing(false);
    }

    return result;
  };

  return (
    <div className="max-w-270">
      <div className="mb-2.5 flex items-center gap-2 text-muted-foreground-2 text-sm">
        <Link
          className="text-link transition-colors hover:text-link-hover"
          to="/clients"
        >
          {m.nav_clients()}
        </Link>
        <span>/</span>
        <Link
          className="text-link transition-colors hover:text-link-hover"
          params={{ clientSlug: client.slug }}
          to="/clients/$clientSlug"
        >
          {client.name}
        </Link>
        <span>/</span>
        <span className="text-muted-foreground">{mission.name}</span>
      </div>

      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className={cn(
                "h-4 w-0.75 shrink-0 rounded-sm",
                COLOR_CLASSES[barColor],
              )}
            />
            <h1 className="font-heading font-semibold text-2xl text-foreground-hi">
              {mission.name}
            </h1>
            <MissionStatusBadge
              clientType={client.type}
              status={mission.status}
            />
          </div>
          <p className="mt-1.5 pl-4 text-muted-foreground-3 text-sm">
            {[
              `${clientTypeLabel(client.type)} ${client.name}`,
              mission.endClientName !== null &&
                m.missions_detail_end_client({ name: mission.endClientName }),
              mission.startDate !== null &&
                m.missions_detail_since({
                  month: calendarMonthYearLabel(
                    format.locale,
                    mission.startDate,
                  ),
                }),
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
        <div className="flex min-w-0 flex-wrap gap-2">
          <Button
            onClick={() => setIsEditing((editing) => !editing)}
            size="xl"
            variant="outline"
          >
            {isEditing ? m.common_close() : m.common_edit()}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  aria-label={m.common_more_actions()}
                  size="icon-xl"
                  variant="outline"
                />
              }
            >
              <MoreHorizontalIcon aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-54">
              <DropdownMenuItem
                disabled={isStatusPending}
                onClick={() => onSetStatus(isDone ? 0 : 2)}
              >
                <CheckIcon aria-hidden />
                {isDone ? m.missions_resume() : m.missions_mark_done()}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {client.missions.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="shrink-0 text-muted-foreground-2 text-xs">
            {m.missions_siblings_at({ client: client.name })}
          </span>
          {client.missions.map((sibling) => {
            const isCurrent = sibling.id === mission.id;
            return (
              <Link
                key={sibling.id}
                aria-current={isCurrent ? "page" : undefined}
                className={cn(
                  "inline-flex h-8 items-center gap-2 rounded-md border px-3 text-sm transition-colors",
                  isCurrent
                    ? "border-primary/45 bg-primary/10 font-medium text-primary-text"
                    : "border-border-2 text-muted-foreground-3 hover:border-muted-foreground-6 hover:text-foreground-hi",
                )}
                params={{ clientSlug: client.slug, missionSlug: sibling.slug }}
                to="/clients/$clientSlug/missions/$missionSlug"
              >
                <span
                  aria-hidden
                  className={cn(
                    "h-3 w-0.75 shrink-0 rounded-sm",
                    COLOR_CLASSES[sibling.color ?? client.color],
                  )}
                />
                {sibling.name}
              </Link>
            );
          })}
          <Link
            aria-label={m.missions_new_title()}
            className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border-2 border-dashed text-muted-foreground-3 transition-colors hover:border-primary hover:text-primary-text"
            search={{ client: client.slug }}
            to="/missions/new"
          >
            <PlusIcon aria-hidden className="size-3.25" strokeWidth={2.2} />
          </Link>
        </div>
      )}

      {error ? (
        <Alert className="mb-5" variant="warn">
          <CircleAlert />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <StatTileRow className="mb-5 grid-cols-2 md:grid-cols-4">
        <StatTile
          label={m.missions_stat_this_month()}
          value="—"
          tone="strong"
        />
        <StatTile
          label={m.missions_stat_revenue_month()}
          value="—"
          tone="brand"
        />
        <StatTile label={m.missions_stat_revenue_total()} value="—" />
        <StatTile label={m.missions_stat_monthly_average()} value="—" />
      </StatTileRow>

      {isEditing ? (
        <MissionEditForm
          client={client}
          isPending={isUpdatePending}
          mission={mission}
          onCancel={() => setIsEditing(false)}
          onSubmit={handleUpdate}
        />
      ) : (
        <Tabs defaultValue="entries">
          <TabsList className="mb-5" variant="underline">
            <TabsTrigger value="entries">
              {m.missions_tab_entries()}
            </TabsTrigger>
            <TabsTrigger value="invoices">{m.nav_invoices()}</TabsTrigger>
            {mission.craRequired && (
              <TabsTrigger value="cra">{m.nav_cra()}</TabsTrigger>
            )}
            <TabsTrigger value="documents">
              {m.common_documents_title()}
            </TabsTrigger>
            <TabsTrigger value="config">
              {m.missions_tab_configuration()}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="entries">
            <div className="overflow-hidden rounded-md border bg-card">
              <div
                className={cn(
                  EYEBROW_CLASSES,
                  "grid grid-cols-[5.5rem_5.75rem_minmax(0,1fr)_7.25rem] border-b px-5 py-3",
                )}
              >
                <div>{m.common_date_label()}</div>
                <div>{m.common_duration()}</div>
                <div>{m.common_note_label()}</div>
                <div className="text-right">
                  {m.missions_entries_header_state()}
                </div>
              </div>
              <div className="px-5 py-6 text-center text-muted-foreground-3 text-sm">
                {m.missions_entries_empty()}
              </div>
              <div className="flex items-center justify-between bg-muted px-5 py-3.5">
                <span className="text-muted-foreground-3 text-sm">
                  {m.missions_entries_from_week()}
                </span>
                <Link
                  className="text-link text-sm transition-colors hover:text-link-hover"
                  to="/week"
                >
                  {m.missions_open_week()}
                </Link>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="invoices">
            <div className="rounded-md border bg-card px-7 py-9 text-center">
              <div className="mb-2 font-heading font-semibold text-base text-foreground-hi">
                {m.common_no_invoices_title()}
              </div>
              <p className="mx-auto max-w-md text-pretty text-muted-foreground-3 text-sm leading-relaxed">
                {isBillable
                  ? m.missions_no_invoices_billable_hint()
                  : m.missions_no_invoices_unbillable_hint()}
              </p>
            </div>
          </TabsContent>

          {mission.craRequired && (
            <TabsContent value="cra">
              <div className="rounded-md border bg-card px-7 py-9 text-center">
                <div className="mb-2 font-heading font-semibold text-base text-foreground-hi">
                  {m.missions_cra_title()}
                </div>
                <p className="mx-auto mb-4.5 max-w-md text-pretty text-muted-foreground-3 text-sm leading-relaxed">
                  {m.missions_cra_hint()}
                </p>
                <Button onClick={onOpenCra}>{m.missions_open_cras()}</Button>
              </div>
            </TabsContent>
          )}

          {/* keepMounted preserves the upload queue while browsing other tabs. */}
          <TabsContent keepMounted value="documents">
            {documentsTab}
          </TabsContent>

          <TabsContent value="config">
            <div className="grid items-start gap-3.5 md:grid-cols-2">
              <div className="rounded-md border bg-card p-5">
                <div className={`${EYEBROW_CLASSES} mb-4`}>
                  {m.missions_config_pricing()}
                </div>
                {isBillable && mission.rate !== null ? (
                  <div>
                    <div className="mb-1.5 text-muted-foreground-3 text-sm">
                      {m.missions_rate_ht()}
                    </div>
                    <div className="inline-flex items-baseline gap-2">
                      <span className="font-mono text-foreground-hi text-xl tabular-nums">
                        {formatAmount(format, mission.rate.amount)}
                      </span>
                      <span className="text-muted-foreground-2 text-sm">
                        {billingModeUnitShort(format, mission.billingMode)}
                      </span>
                    </div>
                    {mission.billingMode !== 2 && (
                      <>
                        <div className="mt-3.5 mb-1.5 text-muted-foreground-3 text-sm">
                          {m.missions_rounding_label()}
                        </div>
                        <div className="inline-flex h-9 items-center rounded-md border border-border-4 bg-secondary px-3 font-mono text-foreground-hi text-sm">
                          {entryRoundingLabel(
                            mission.rounding ?? 0,
                            mission.billingMode,
                          )}
                        </div>
                      </>
                    )}
                    <div className="mt-3.5 mb-1.5 text-muted-foreground-3 text-sm">
                      {m.clients_payment_terms_label()}
                    </div>
                    <div className="font-mono text-foreground-2 text-sm">
                      {paymentTermsLabel(client.paymentTermsDays)}
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm leading-relaxed">
                    {m.missions_unbillable_note()}
                  </div>
                )}
              </div>

              <div className="rounded-md border bg-card p-5">
                <div className={`${EYEBROW_CLASSES} mb-4`}>
                  {m.common_billing_title()}
                </div>
                <div className="flex flex-col gap-3.5">
                  <FacturationRow
                    label={m.missions_billed_to()}
                    value={client.name}
                  />
                  <FacturationRow
                    label={m.missions_end_client_label()}
                    value={mission.endClientName ?? "—"}
                  />
                  <FacturationRow
                    label={m.missions_since_label()}
                    value={
                      mission.startDate === null
                        ? "—"
                        : calendarDateLabel(format.locale, mission.startDate)
                    }
                  />
                  <FacturationRow
                    label={m.missions_end_label()}
                    value={
                      mission.endDate === null
                        ? "—"
                        : calendarDateLabel(format.locale, mission.endDate)
                    }
                  />
                </div>
                <div className="my-4 h-px bg-border" />
                <div className="flex items-center gap-3">
                  <Switch
                    aria-label={m.missions_cra_required()}
                    checked={mission.craRequired}
                    disabled
                  />
                  <span className="text-foreground-3 text-sm">
                    {mission.craRequired
                      ? m.missions_cra_required()
                      : m.missions_cra_not_required()}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
