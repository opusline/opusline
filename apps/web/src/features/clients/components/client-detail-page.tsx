import type {
  ClientRevenueData,
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
import { eyebrowVariants } from "@opusline/ui/components/eyebrow";
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
import { type ReactNode, useMemo, useState } from "react";
import { ClientLogo } from "@/components/client-logo";
import { MissionStatusBadge } from "@/components/mission-status-badge";
import { useMoneyFormat } from "@/components/money-format-provider";
import {
  formatMissionRate,
  formatPercentFromBp,
  paymentTermsLabel,
} from "@/lib/billing";
import {
  formatPaymentDelay,
  formatRevenue,
  formatTrackedMonth,
  indexMissionRevenue,
  revenueYearLabel,
} from "@/lib/client-revenue";
import { clientTypeLabel } from "@/lib/client-types";
import { monthYearLabel } from "@/lib/dates";
import type { FormSubmitResult } from "@/lib/form";
import type { LogoUploadResult } from "@/lib/logos";
import { COLOR_CLASSES } from "@/lib/palette";
import { m } from "@/paraglide/messages.js";
import { formatPostalAddress } from "../lib/client-form";
import type { ClientTab } from "../lib/tabs";

import { ClientEditForm } from "./client-edit-form";

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
  tab: ClientTab;
  onTabChange: (tab: ClientTab) => void;
  documentsTab: ReactNode;
  invoicesTab: ReactNode;
  onUpdate: (body: UpdateClientData) => Promise<FormSubmitResult>;
  onToggleArchive: () => void;
  logoSrc: string;
  onUploadLogo: (logo: File) => Promise<LogoUploadResult>;
  onRemoveLogo: () => Promise<boolean>;
  /** Whether the account charges TVA at all; under the franchise en base it never does. */
  vatLiable: boolean;
  /** The rate a client with no rate of its own is billed at. */
  accountVatRateBp: number;
  isUpdatePending?: boolean;
  isArchivePending?: boolean;
  error?: string | null;
  /** Undefined while the figures are still loading; tiles show a placeholder. */
  revenue?: ClientRevenueData;
  /** The civil year the revenue tile covers, when the figures have landed. */
  revenueYear?: number;
  /** The figures could not be fetched — placeholders alone would read as "none". */
  revenueFailed?: boolean;
};

export function ClientDetailPage({
  client,
  tab,
  onTabChange,
  documentsTab,
  invoicesTab,
  onUpdate,
  onToggleArchive,
  logoSrc,
  onUploadLogo,
  onRemoveLogo,
  vatLiable,
  accountVatRateBp,
  isUpdatePending,
  isArchivePending,
  error,
  revenue,
  revenueYear,
  revenueFailed,
}: ClientDetailPageProps) {
  const format = useMoneyFormat();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const missionRevenues = useMemo(
    () => indexMissionRevenue(revenue === undefined ? undefined : [revenue]),
    [revenue],
  );

  const isArchived = client.archivedAt !== null;
  // Null under the franchise en base whatever the client stores: no invoice for
  // them will carry that rate, so the card must not claim it.
  const ownVatRateBp = vatLiable ? client.defaultVatRateBp : null;
  const hasCoordinates =
    client.siret !== null ||
    client.vatNumber !== null ||
    ownVatRateBp !== null ||
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
          {m.nav_clients()}
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
              {isArchived && (
                <Badge variant="quiet">{m.clients_badge_archived()}</Badge>
              )}
            </div>
            <p className="mt-1.5 text-muted-foreground-3 text-sm">
              {m.clients_since_subtitle({
                month: monthYearLabel(format.locale, client.createdAt),
                terms: paymentTermsLabel(client.paymentTermsDays),
              })}
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
              {m.missions_new_title()}
            </Button>
          )}
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
            <DropdownMenuContent align="end" className="min-w-63">
              <DropdownMenuItem
                disabled={isArchivePending}
                onClick={onToggleArchive}
              >
                <ArchiveIcon aria-hidden />
                {isArchived ? m.clients_reactivate() : m.clients_archive()}
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

      {revenueFailed ? (
        <Alert className="mb-5" variant="warn">
          <CircleAlert />
          <AlertDescription>{m.revenue_load_failed()}</AlertDescription>
        </Alert>
      ) : null}

      <StatTileRow className="mb-5 grid-cols-2 md:grid-cols-4">
        <StatTile
          label={revenueYearLabel(revenueYear)}
          value={formatRevenue(format, revenue?.yearToDate)}
          tone="brand"
        />
        <StatTile
          label={m.clients_head_pending()}
          value={formatRevenue(format, revenue?.pending)}
          tone="strong"
        />
        <StatTile
          label={m.clients_head_average_delay()}
          value={formatPaymentDelay(revenue?.averagePaymentDelayDays)}
        />
        <StatTile
          label={m.clients_missions_title()}
          value={String(client.missions.length)}
        />
      </StatTileRow>

      {isEditing ? (
        <ClientEditForm
          accountVatRateBp={accountVatRateBp}
          client={client}
          isPending={isUpdatePending}
          logoSrc={logoSrc}
          onCancel={() => setIsEditing(false)}
          onRemoveLogo={onRemoveLogo}
          onSubmit={handleUpdate}
          onUploadLogo={onUploadLogo}
          vatLiable={vatLiable}
        />
      ) : (
        <Tabs
          onValueChange={(value) => onTabChange(value as ClientTab)}
          value={tab}
        >
          <TabsList className="mb-5" variant="underline">
            <TabsTrigger value="missions">
              {m.clients_missions_title()}
            </TabsTrigger>
            <TabsTrigger value="factures">{m.nav_invoices()}</TabsTrigger>
            <TabsTrigger value="documents">
              {m.common_documents_title()}
            </TabsTrigger>
            <TabsTrigger value="coordonnees">
              {m.clients_tab_details()}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="missions">
            {client.missions.length > 0 ? (
              <div className="overflow-hidden rounded-md border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead
                        className={cn(eyebrowVariants(), "w-1/3 py-3 pl-5")}
                      >
                        {m.clients_head_mission()}
                      </TableHead>
                      <TableHead className={cn(eyebrowVariants(), "w-1/6")}>
                        {m.clients_head_rate()}
                      </TableHead>
                      <TableHead className={cn(eyebrowVariants(), "w-1/6")}>
                        {m.missions_stat_this_month()}
                      </TableHead>
                      <TableHead
                        className={cn(eyebrowVariants(), "w-1/6 text-right")}
                      >
                        {m.clients_head_revenue_short()}
                      </TableHead>
                      <TableHead
                        className={cn(
                          eyebrowVariants(),
                          "w-28 py-3 pr-5 text-right",
                        )}
                      >
                        {m.missions_status_head()}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {client.missions.map((mission) => {
                      const missionRevenue = missionRevenues.get(mission.id);

                      return (
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
                            {formatTrackedMonth(format.locale, missionRevenue)}
                          </TableCell>
                          <TableCell className="py-4 text-right font-mono text-primary-text tabular-nums">
                            {formatRevenue(format, missionRevenue?.yearToDate)}
                          </TableCell>
                          <TableCell className="py-4 pr-5 text-right">
                            <MissionStatusBadge
                              clientType={client.type}
                              status={mission.status}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="rounded-md border bg-card px-7 py-9 text-center">
                <div className="mb-2 font-heading font-semibold text-base text-foreground-hi">
                  {m.clients_no_missions()}
                </div>
                <p className="mb-5 text-muted-foreground-3 text-sm leading-relaxed">
                  {isArchived
                    ? m.clients_archived_row_note()
                    : m.clients_missions_empty_hint()}
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
                    {m.clients_create_mission()}
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="factures">{invoicesTab}</TabsContent>

          <TabsContent keepMounted value="documents">
            {documentsTab}
          </TabsContent>

          <TabsContent value="coordonnees">
            {hasCoordinates ? (
              <div className="grid items-start gap-3.5 md:grid-cols-2">
                <div className="rounded-md border bg-card p-5">
                  <div className={`${eyebrowVariants()} mb-4`}>
                    {m.clients_identity_title()}
                  </div>
                  <div className="flex flex-col gap-3.5">
                    <CoordRow label="SIRET" mono value={client.siret} />
                    <CoordRow
                      label={m.clients_vat_short_label()}
                      mono
                      value={client.vatNumber}
                    />
                    {ownVatRateBp !== null && (
                      <CoordRow
                        label={m.clients_vat_rate_label()}
                        value={m.common_percent({
                          value: formatPercentFromBp(
                            format.locale,
                            ownVatRateBp,
                          ),
                        })}
                      />
                    )}
                    <CoordRow
                      label={m.address_label()}
                      value={formatPostalAddress(client)}
                    />
                  </div>
                </div>
                <div className="rounded-md border bg-card p-5">
                  <div className={`${eyebrowVariants()} mb-4`}>
                    {m.common_billing_title()}
                  </div>
                  <div className="flex flex-col gap-3.5">
                    <CoordRow
                      label={m.clients_contact_title()}
                      value={client.billingContactName}
                    />
                    <CoordRow
                      label={m.common_email()}
                      value={client.billingEmail}
                    />
                    <CoordRow
                      label={m.clients_payment_terms_label()}
                      value={paymentTermsLabel(client.paymentTermsDays)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-md border bg-card px-7 py-9 text-center">
                <div className="mb-2 font-heading font-semibold text-base text-foreground-hi">
                  {m.clients_details_empty_title()}
                </div>
                <p className="mx-auto mb-5 max-w-md text-pretty text-muted-foreground-3 text-sm leading-relaxed">
                  {m.clients_details_empty_hint()}
                </p>
                <Button onClick={() => setIsEditing(true)} size="xl">
                  {m.clients_details_fill()}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
