import type { EInvoicingSettingsData } from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import {
  StatusRow,
  StatusRowActions,
  StatusRowContent,
  StatusRowDescription,
  StatusRowMedia,
  StatusRowTitle,
} from "@opusline/ui/components/status-row";
import { CircleAlert, Inbox, RefreshCw } from "lucide-react";

import { useLocale } from "@/components/money-format-provider";
import { fullDateTimeLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

import { eInvoicingErrorLabel } from "../lib/e-invoice";

type PlatformInboxCardProps = {
  settings: EInvoicingSettingsData;
  /** Expenses of the shown month that came through the platform. */
  count: number;
  isSyncing: boolean;
  /** A sync that just failed, with the server's word; the connection's own last error shows otherwise. */
  error: string | null;
  onSync: () => void;
};

/**
 * « Reçues par la plateforme »: the supplier invoices the plateforme agréée
 * delivered land in the journal on their own every night; this is where the
 * account reads them in now, and learns when the platform refused.
 */
export function PlatformInboxCard({
  settings,
  count,
  isSyncing,
  error,
  onSync,
}: PlatformInboxCardProps) {
  const locale = useLocale();
  const failure =
    error ??
    (settings.lastError === null
      ? null
      : eInvoicingErrorLabel(settings.lastError));

  return (
    <section
      className="flex flex-col gap-3"
      data-count={count}
      data-status={failure === null ? "ok" : "failed"}
      data-testid="platform-inbox"
    >
      {failure === null ? null : (
        <Alert data-testid="platform-inbox-error" variant="warn">
          <CircleAlert />
          <AlertDescription>{failure}</AlertDescription>
        </Alert>
      )}
      <StatusRow>
        <StatusRowMedia>
          <Inbox aria-hidden />
        </StatusRowMedia>
        <StatusRowContent>
          <StatusRowTitle>{m.expenses_platform_inbox_title()}</StatusRowTitle>
          <StatusRowDescription className="flex flex-col gap-0.5">
            <span>{m.expenses_platform_inbox_count({ count })}</span>
            <span data-testid="platform-inbox-last-sync">
              {settings.lastSyncedAt === null
                ? m.expenses_platform_inbox_never()
                : m.expenses_platform_inbox_last_sync({
                    date: fullDateTimeLabel(locale, settings.lastSyncedAt),
                  })}
            </span>
          </StatusRowDescription>
        </StatusRowContent>
        <StatusRowActions>
          <Button
            data-testid="einvoice-sync"
            disabled={isSyncing}
            onClick={onSync}
            size="lg"
            variant="secondary"
          >
            <RefreshCw aria-hidden data-icon="inline-start" />
            {isSyncing
              ? m.expenses_platform_inbox_syncing()
              : m.expenses_platform_inbox_sync()}
          </Button>
        </StatusRowActions>
      </StatusRow>
    </section>
  );
}
