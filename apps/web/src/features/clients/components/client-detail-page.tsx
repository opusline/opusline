import type {
  ClientWithMissionsData,
  UpdateClientData,
} from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Badge } from "@opusline/ui/components/badge";
import { Button } from "@opusline/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@opusline/ui/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@opusline/ui/components/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@opusline/ui/components/tabs";
import { cn } from "@opusline/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  ArchiveIcon,
  CircleAlert,
  MoreHorizontalIcon,
  PlusIcon,
} from "lucide-react";
import { useState } from "react";

import {
  CLIENT_TYPE_OPTION_LABELS,
  COLOR_CLASSES,
  clientInitials,
  clientSinceLabel,
  formatMissionRate,
  MISSION_STATUS_BADGE_VARIANTS,
  MISSION_STATUS_LABELS,
  paymentTermsLabel,
} from "../lib/labels";
import { ClientEditForm } from "./client-edit-form";

const EYEBROW_CLASSES =
  "font-medium text-muted-foreground-2 text-xs uppercase tracking-widest";
const HEAD_CLASSES =
  "font-medium text-muted-foreground-2 text-xs uppercase tracking-widest";

function StatTile({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName: string;
}) {
  return (
    <div className="bg-card p-4">
      <div className={EYEBROW_CLASSES}>{label}</div>
      <div
        className={cn(
          "mt-2 whitespace-nowrap font-mono text-xl tabular-nums",
          valueClassName,
        )}
      >
        {value}
      </div>
    </div>
  );
}

function CoordRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | null;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="shrink-0 text-muted-foreground-3 text-sm">{label}</span>
      <span
        className={cn(
          "whitespace-pre-line text-right text-foreground-2 text-sm",
          mono && "font-mono",
        )}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}

type ClientDetailPageProps = {
  client: ClientWithMissionsData;
  onUpdate: (
    body: UpdateClientData,
  ) => Promise<Record<string, { message: string }> | null | undefined>;
  onToggleArchive: () => void;
  isUpdatePending?: boolean;
  isArchivePending?: boolean;
  error?: string | null;
};

export function ClientDetailPage({
  client,
  onUpdate,
  onToggleArchive,
  isUpdatePending,
  isArchivePending,
  error,
}: ClientDetailPageProps) {
  const [isEditing, setIsEditing] = useState(false);

  const isArchived = client.archivedAt !== null;
  const currentYear = new Date().getFullYear();
  const hasCoordinates =
    client.siret !== null ||
    client.vatNumber !== null ||
    client.billingAddress !== null;

  const handleUpdate = async (body: UpdateClientData) => {
    const fieldErrors = await onUpdate(body);

    if (!fieldErrors) {
      setIsEditing(false);
    }

    return fieldErrors;
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-3 flex items-center gap-2 text-muted-foreground-2 text-sm">
        <Link
          className="text-link transition-colors hover:text-link-hover"
          to="/clients"
        >
          Clients
        </Link>
        <span>/</span>
        <span className="text-muted-foreground">{client.name}</span>
      </div>

      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3.5">
          <span className="flex size-18 shrink-0 items-center justify-center rounded-md border border-border-2 bg-secondary font-heading font-medium text-2xl text-muted-foreground-4 tracking-wide">
            {clientInitials(client.name)}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden
                className={cn(
                  "size-2.5 shrink-0 rounded-sm",
                  COLOR_CLASSES[client.color],
                )}
              />
              <h1 className="font-heading font-semibold text-2xl text-foreground-hi">
                {client.name}
              </h1>
              <Badge>{CLIENT_TYPE_OPTION_LABELS[client.type]}</Badge>
              {isArchived && <Badge variant="quiet">Archivé</Badge>}
            </div>
            <p className="mt-1.5 text-muted-foreground-3 text-sm">
              Client depuis {clientSinceLabel(client.createdAt)} · paiement à{" "}
              {paymentTermsLabel(client.paymentTermsDays)}
            </p>
          </div>
        </div>
        <div className="flex min-w-0 flex-wrap gap-2">
          <Button size="xl">
            <PlusIcon aria-hidden data-icon="inline-start" />
            Nouvelle mission
          </Button>
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
            <DropdownMenuContent align="end" className="min-w-63">
              <DropdownMenuItem
                disabled={isArchivePending}
                onClick={onToggleArchive}
              >
                <ArchiveIcon aria-hidden />
                {isArchived ? "Réactiver ce client" : "Archiver ce client"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {error ? (
        <Alert className="mb-5" variant="warn">
          <CircleAlert />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="mb-5 grid grid-cols-2 gap-px overflow-hidden rounded-md border bg-border md:grid-cols-4">
        <StatTile
          label={`CA ${currentYear}`}
          value="—"
          valueClassName="text-primary-text"
        />
        <StatTile
          label="En attente"
          value="—"
          valueClassName="text-foreground-hi"
        />
        <StatTile
          label="Délai moyen"
          value="—"
          valueClassName="text-foreground-2"
        />
        <StatTile
          label="Missions"
          value={String(client.missions.length)}
          valueClassName="text-foreground-2"
        />
      </div>

      {isEditing ? (
        <ClientEditForm
          client={client}
          isPending={isUpdatePending}
          onCancel={() => setIsEditing(false)}
          onSubmit={handleUpdate}
        />
      ) : (
        <Tabs defaultValue="missions">
          <TabsList className="mb-5" variant="underline">
            <TabsTrigger value="missions">Missions</TabsTrigger>
            <TabsTrigger value="factures">Factures</TabsTrigger>
            <TabsTrigger value="coordonnees">Coordonnées</TabsTrigger>
          </TabsList>

          <TabsContent value="missions">
            {client.missions.length > 0 ? (
              <div className="overflow-hidden rounded-md border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead
                        className={cn(HEAD_CLASSES, "w-1/3 py-3 pl-5")}
                      >
                        Mission
                      </TableHead>
                      <TableHead className={cn(HEAD_CLASSES, "w-1/6")}>
                        Tarif
                      </TableHead>
                      <TableHead className={cn(HEAD_CLASSES, "w-1/6")}>
                        Ce mois
                      </TableHead>
                      <TableHead
                        className={cn(HEAD_CLASSES, "w-1/6 text-right")}
                      >
                        CA
                      </TableHead>
                      <TableHead
                        className={cn(
                          HEAD_CLASSES,
                          "w-28 py-3 pr-5 text-right",
                        )}
                      >
                        Statut
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {client.missions.map((mission) => (
                      <TableRow
                        key={mission.id}
                        className="border-accent hover:bg-accent"
                      >
                        <TableCell className="py-4 pl-5">
                          <div className="flex min-w-0 items-center gap-2.5">
                            <span
                              aria-hidden
                              className={cn(
                                "h-3 w-0.75 shrink-0 rounded-sm",
                                COLOR_CLASSES[mission.color ?? client.color],
                              )}
                            />
                            <span className="truncate text-foreground-hi text-sm">
                              {mission.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-muted-foreground-3 text-sm">
                          {formatMissionRate(mission)}
                        </TableCell>
                        <TableCell className="py-4 font-mono text-foreground-2 tabular-nums">
                          —
                        </TableCell>
                        <TableCell className="py-4 text-right font-mono text-primary-text tabular-nums">
                          —
                        </TableCell>
                        <TableCell className="py-4 pr-5 text-right">
                          {client.type === 2 ? (
                            <Badge variant="quiet">Perso</Badge>
                          ) : (
                            <Badge
                              variant={
                                MISSION_STATUS_BADGE_VARIANTS[mission.status]
                              }
                            >
                              {MISSION_STATUS_LABELS[mission.status]}
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="rounded-md border bg-card px-7 py-9 text-center">
                <div className="mb-2 font-heading font-semibold text-base text-foreground-hi">
                  Aucune mission
                </div>
                <p className="mb-5 text-muted-foreground-3 text-sm leading-relaxed">
                  Ce client n'a pas de mission active. Créez-en une pour pouvoir
                  suivre du temps dessus.
                </p>
                <Button size="xl">Créer une mission</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="factures">
            <div className="rounded-md border bg-card px-7 py-9 text-center">
              <div className="mb-2 font-heading font-semibold text-base text-foreground-hi">
                Aucune facture
              </div>
              <p className="mx-auto max-w-md text-pretty text-muted-foreground-3 text-sm leading-relaxed">
                Les factures apparaîtront ici dès que du temps facturable aura
                été saisi sur une mission de ce client.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="coordonnees">
            {hasCoordinates ? (
              <div className="grid items-start gap-3.5 md:grid-cols-2">
                <div className="rounded-md border bg-card p-5">
                  <div className={`${EYEBROW_CLASSES} mb-4`}>Identité</div>
                  <div className="flex flex-col gap-3.5">
                    <CoordRow label="SIRET" mono value={client.siret} />
                    <CoordRow
                      label="TVA intracom."
                      mono
                      value={client.vatNumber}
                    />
                    <CoordRow label="Adresse" value={client.billingAddress} />
                  </div>
                </div>
                <div className="rounded-md border bg-card p-5">
                  <div className={`${EYEBROW_CLASSES} mb-4`}>Facturation</div>
                  <div className="flex flex-col gap-3.5">
                    <CoordRow
                      label="Contact"
                      value={client.billingContactName}
                    />
                    <CoordRow label="Email" value={client.billingEmail} />
                    <CoordRow
                      label="Délai de paiement"
                      value={paymentTermsLabel(client.paymentTermsDays)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-md border bg-card px-7 py-9 text-center">
                <div className="mb-2 font-heading font-semibold text-base text-foreground-hi">
                  Coordonnées à compléter
                </div>
                <p className="mx-auto mb-5 max-w-md text-pretty text-muted-foreground-3 text-sm leading-relaxed">
                  SIRET, TVA et adresse sont nécessaires pour émettre une
                  facture à ce client.
                </p>
                <Button onClick={() => setIsEditing(true)} size="xl">
                  Renseigner les coordonnées
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
