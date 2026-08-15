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
import { StatTile, StatTileRow } from "@opusline/ui/components/stat-tile";
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
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArchiveIcon,
  CircleAlert,
  MoreHorizontalIcon,
  PlusIcon,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { ClientLogo } from "@/components/client-logo";
import { MissionStatusBadge } from "@/components/mission-status-badge";
import { useMoneyFormat } from "@/components/money-format-provider";
import { formatMissionRate, paymentTermsLabel } from "@/lib/billing";
import { clientTypeLabel } from "@/lib/client-types";
import { monthYearLabel } from "@/lib/dates";
import type { FormSubmitResult } from "@/lib/form";
import type { LogoUploadResult } from "@/lib/logos";
import { COLOR_CLASSES } from "@/lib/palette";
import { formatPostalAddress } from "../lib/client-form";

import { ClientEditForm } from "./client-edit-form";

const EYEBROW_CLASSES =
  "font-medium text-muted-foreground-2 text-xs uppercase tracking-widest";
const HEAD_CLASSES =
  "font-medium text-muted-foreground-2 text-xs uppercase tracking-widest";

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
  documentsTab: ReactNode;
  onUpdate: (body: UpdateClientData) => Promise<FormSubmitResult>;
  onToggleArchive: () => void;
  logoSrc: string;
  onUploadLogo: (logo: File) => Promise<LogoUploadResult>;
  onRemoveLogo: () => Promise<boolean>;
  isUpdatePending?: boolean;
  isArchivePending?: boolean;
  error?: string | null;
};

export function ClientDetailPage({
  client,
  documentsTab,
  onUpdate,
  onToggleArchive,
  logoSrc,
  onUploadLogo,
  onRemoveLogo,
  isUpdatePending,
  isArchivePending,
  error,
}: ClientDetailPageProps) {
  const format = useMoneyFormat();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const isArchived = client.archivedAt !== null;
  const currentYear = new Date().getFullYear();
  const hasCoordinates =
    client.siret !== null ||
    client.vatNumber !== null ||
    formatPostalAddress(client) !== null ||
    client.billingContactName !== null ||
    client.billingEmail !== null;

  const handleUpdate = async (body: UpdateClientData) => {
    const result = await onUpdate(body);

    if (result.status === "success") {
      setIsEditing(false);
    }

    return result;
  };

  return (
    <div className="max-w-270">
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
          <ClientLogo name={client.name} size="lg" src={logoSrc} />
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
              <Badge>{clientTypeLabel(client.type)}</Badge>
              {isArchived && <Badge variant="quiet">Archivé</Badge>}
            </div>
            <p className="mt-1.5 text-muted-foreground-3 text-sm">
              Client depuis {monthYearLabel(format.locale, client.createdAt)} ·
              paiement à {paymentTermsLabel(client.paymentTermsDays)}
            </p>
          </div>
        </div>
        <div className="flex min-w-0 flex-wrap gap-2">
          {!isArchived && (
            <Button
              render={
                <Link search={{ client: client.slug }} to="/missions/new" />
              }
              size="xl"
            >
              <PlusIcon aria-hidden data-icon="inline-start" />
              Nouvelle mission
            </Button>
          )}
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

      <StatTileRow className="mb-5 grid-cols-2 md:grid-cols-4">
        <StatTile label={`CA ${currentYear}`} value="—" tone="brand" />
        <StatTile label="En attente" value="—" tone="strong" />
        <StatTile label="Délai moyen" value="—" />
        <StatTile label="Missions" value={String(client.missions.length)} />
      </StatTileRow>

      {isEditing ? (
        <ClientEditForm
          client={client}
          isPending={isUpdatePending}
          logoSrc={logoSrc}
          onCancel={() => setIsEditing(false)}
          onRemoveLogo={onRemoveLogo}
          onSubmit={handleUpdate}
          onUploadLogo={onUploadLogo}
        />
      ) : (
        <Tabs defaultValue="missions">
          <TabsList className="mb-5" variant="underline">
            <TabsTrigger value="missions">Missions</TabsTrigger>
            <TabsTrigger value="factures">Factures</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
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
                        className="cursor-pointer border-accent hover:bg-accent"
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
                        <TableCell className="py-4 pl-5">
                          <div className="flex min-w-0 items-center gap-2.5">
                            <span
                              aria-hidden
                              className={cn(
                                "h-3 w-0.75 shrink-0 rounded-sm",
                                COLOR_CLASSES[mission.color ?? client.color],
                              )}
                            />
                            <Link
                              className="truncate text-foreground-hi text-sm"
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
                        <TableCell className="py-4 text-muted-foreground-3 text-sm">
                          {formatMissionRate(format, mission)}
                        </TableCell>
                        <TableCell className="py-4 font-mono text-foreground-2 tabular-nums">
                          —
                        </TableCell>
                        <TableCell className="py-4 text-right font-mono text-primary-text tabular-nums">
                          —
                        </TableCell>
                        <TableCell className="py-4 pr-5 text-right">
                          <MissionStatusBadge
                            clientType={client.type}
                            status={mission.status}
                          />
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
                  {isArchived
                    ? "Client archivé — réactivez-le pour ajouter une mission."
                    : "Ce client n'a pas de mission active. Créez-en une pour pouvoir suivre du temps dessus."}
                </p>
                {!isArchived && (
                  <Button
                    render={
                      <Link
                        search={{ client: client.slug }}
                        to="/missions/new"
                      />
                    }
                    size="xl"
                  >
                    Créer une mission
                  </Button>
                )}
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

          <TabsContent keepMounted value="documents">
            {documentsTab}
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
                    <CoordRow
                      label="Adresse"
                      value={formatPostalAddress(client)}
                    />
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
