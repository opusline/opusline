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
import { CLIENT_TYPE_LABELS } from "@/lib/client-types";
import { calendarDateLabel, calendarMonthYearLabel } from "@/lib/dates";
import { entryRoundingLabel } from "@/lib/entry-rounding";
import type { FormSubmitResult } from "@/lib/form";
import { COLOR_CLASSES } from "@/lib/palette";

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
          Clients
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
              `${CLIENT_TYPE_LABELS[client.type]} ${client.name}`,
              mission.endClientName !== null &&
                `client final ${mission.endClientName}`,
              mission.startDate !== null &&
                `depuis ${calendarMonthYearLabel(mission.startDate)}`,
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
            {isEditing ? "Fermer" : "Modifier"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  aria-label="Plus d'actions"
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
                {isDone ? "Reprendre la mission" : "Marquer comme terminée"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {client.missions.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="shrink-0 text-muted-foreground-2 text-xs">
            Missions chez {client.name} :
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
            aria-label="Nouvelle mission"
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
        <StatTile label="Ce mois" value="—" tone="strong" />
        <StatTile label="CA ce mois" value="—" tone="brand" />
        <StatTile label="CA cumulé" value="—" />
        <StatTile label="Moyenne / mois" value="—" />
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
            <TabsTrigger value="entries">Entrées</TabsTrigger>
            <TabsTrigger value="invoices">Factures</TabsTrigger>
            {mission.craRequired && <TabsTrigger value="cra">CRA</TabsTrigger>}
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="entries">
            <div className="overflow-hidden rounded-md border bg-card">
              <div
                className={cn(
                  EYEBROW_CLASSES,
                  "grid grid-cols-[5.5rem_5.75rem_minmax(0,1fr)_7.25rem] border-b px-5 py-3",
                )}
              >
                <div>Date</div>
                <div>Durée</div>
                <div>Note</div>
                <div className="text-right">État</div>
              </div>
              <div className="px-5 py-6 text-center text-muted-foreground-3 text-sm">
                Aucune entrée pour le moment.
              </div>
              <div className="flex items-center justify-between bg-muted px-5 py-3.5">
                <span className="text-muted-foreground-3 text-sm">
                  Les entrées se créent depuis la grille de la semaine.
                </span>
                <Link
                  className="text-link text-sm transition-colors hover:text-link-hover"
                  to="/week"
                >
                  Ouvrir la semaine →
                </Link>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="invoices">
            <div className="rounded-md border bg-card px-7 py-9 text-center">
              <div className="mb-2 font-heading font-semibold text-base text-foreground-hi">
                Aucune facture
              </div>
              <p className="mx-auto max-w-md text-pretty text-muted-foreground-3 text-sm leading-relaxed">
                {isBillable
                  ? "Les factures apparaîtront ici dès que du temps facturable aura été saisi sur cette mission."
                  : "Cette mission n'est pas facturable — son temps ne produit pas de facture."}
              </p>
            </div>
          </TabsContent>

          {mission.craRequired && (
            <TabsContent value="cra">
              <div className="rounded-md border bg-card px-7 py-9 text-center">
                <div className="mb-2 font-heading font-semibold text-base text-foreground-hi">
                  Comptes rendus d'activité
                </div>
                <p className="mx-auto mb-4.5 max-w-md text-pretty text-muted-foreground-3 text-sm leading-relaxed">
                  Ce client attend un CRA mensuel. Les mois de cette mission
                  s'empilent sur l'écran dédié, avec leur grille et leur
                  document.
                </p>
                <Button onClick={onOpenCra}>Ouvrir les comptes rendus</Button>
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
                <div className={`${EYEBROW_CLASSES} mb-4`}>Tarification</div>
                {isBillable && mission.rate !== null ? (
                  <div>
                    <div className="mb-1.5 text-muted-foreground-3 text-sm">
                      Tarif HT
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
                          Arrondi des entrées
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
                      Délai de paiement
                    </div>
                    <div className="font-mono text-foreground-2 text-sm">
                      {paymentTermsLabel(client.paymentTermsDays)}
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm leading-relaxed">
                    Mission non facturable : le temps est suivi pour mesurer
                    l'effort, sans tarif ni facture.
                  </div>
                )}
              </div>

              <div className="rounded-md border bg-card p-5">
                <div className={`${EYEBROW_CLASSES} mb-4`}>Facturation</div>
                <div className="flex flex-col gap-3.5">
                  <FacturationRow label="Facturé à" value={client.name} />
                  <FacturationRow
                    label="Client final"
                    value={mission.endClientName ?? "—"}
                  />
                  <FacturationRow
                    label="Depuis"
                    value={
                      mission.startDate === null
                        ? "—"
                        : calendarDateLabel(mission.startDate)
                    }
                  />
                  <FacturationRow
                    label="Fin prévue"
                    value={
                      mission.endDate === null
                        ? "—"
                        : calendarDateLabel(mission.endDate)
                    }
                  />
                </div>
                <div className="my-4 h-px bg-border" />
                <div className="flex items-center gap-3">
                  <Switch
                    aria-label="CRA mensuel requis"
                    checked={mission.craRequired}
                    disabled
                  />
                  <span className="text-foreground-3 text-sm">
                    {mission.craRequired
                      ? "CRA mensuel requis"
                      : "CRA non requis"}
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
