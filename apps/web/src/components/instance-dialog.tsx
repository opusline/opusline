import type { BackupRecordData } from "@opusline/api-client";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@opusline/ui/components/alert";
import { CopyButton } from "@opusline/ui/components/copy-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@opusline/ui/components/dialog";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { CircleAlert, ExternalLink } from "lucide-react";

import { useLocale } from "@/components/money-format-provider";
import { fullDateTimeLabel, wholeDaysSince } from "@/lib/dates";
import { formatFileSize } from "@/lib/documents";
import { m } from "@/paraglide/messages.js";

const UNKNOWN = "—";
const BACKUP_COMMAND = "./opusline-backup.sh backup";
const BACKUP_DOCS =
  "https://github.com/opusline/opusline/blob/main/docs/self-hosting.md#backups";

type InstanceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  version: string | null;
  database: string | null;
  backup: BackupRecordData | null;
  isPending: boolean;
  error: string | null;
};

/**
 * What this instance is, and whether anyone has ever backed it up.
 *
 * The backup line is a record rather than a reading: the archive is on the host,
 * outside anything the container can see, so the app can only repeat what
 * `opusline-backup.sh` told it the last time it ran — and say so.
 */
export function InstanceDialog({
  open,
  onOpenChange,
  version,
  database,
  backup,
  isPending,
  error,
}: InstanceDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent size="lg">
        <DialogHeader className="gap-2">
          <DialogTitle size="lg">{m.account_instance_backups()}</DialogTitle>
        </DialogHeader>

        {error !== null && (
          <Alert variant="destructive">
            <CircleAlert />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
          <dt className="text-muted-foreground-3">
            {m.instance_version_label()}
          </dt>
          <dd className="text-right font-mono tabular-nums">
            {isPending ? (
              <Skeleton className="ml-auto h-4 w-16" />
            ) : (
              (version ?? UNKNOWN)
            )}
          </dd>
          <dt className="text-muted-foreground-3">
            {m.instance_database_label()}
          </dt>
          <dd className="text-right font-mono">
            {isPending ? (
              <Skeleton className="ml-auto h-4 w-16" />
            ) : (
              (database ?? UNKNOWN)
            )}
          </dd>
        </dl>

        <section className="flex flex-col gap-3 border-t pt-4">
          <h3 className="font-heading font-semibold text-base text-foreground-hi">
            {m.instance_backups_heading()}
          </h3>

          <BackupState
            backup={backup}
            hasFailed={error !== null}
            isPending={isPending}
          />

          <p className="text-muted-foreground-3 text-sm">
            {m.instance_backup_how()}
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate rounded-md border bg-muted px-3 py-2 font-mono text-sm">
              {BACKUP_COMMAND}
            </code>
            <CopyButton
              aria-label={m.common_copy()}
              copiedLabel={m.common_copied()}
              failedLabel={m.common_copy_failed()}
              size="icon"
              value={BACKUP_COMMAND}
            />
          </div>
          <a
            className="inline-flex items-center gap-1.5 text-link text-sm hover:text-link-hover hover:underline"
            href={BACKUP_DOCS}
            rel="noreferrer"
            target="_blank"
          >
            {m.instance_backup_docs()}
            <ExternalLink aria-hidden className="size-3.5" />
          </a>
        </section>
      </DialogContent>
    </Dialog>
  );
}

/** Nothing at all when the read failed: a failed read is not a missing backup. */
function BackupState({
  backup,
  hasFailed,
  isPending,
}: {
  backup: BackupRecordData | null;
  hasFailed: boolean;
  isPending: boolean;
}) {
  if (isPending) {
    return <Skeleton className="h-16 w-full" />;
  }

  if (hasFailed) {
    return null;
  }

  if (backup === null) {
    return (
      <Alert variant="warn">
        <CircleAlert />
        <AlertTitle>{m.instance_backup_none_title()}</AlertTitle>
        <AlertDescription>{m.instance_backup_none_body()}</AlertDescription>
      </Alert>
    );
  }

  return <LastBackup backup={backup} />;
}

function LastBackup({ backup }: { backup: BackupRecordData }) {
  const locale = useLocale();
  const days = wholeDaysSince(backup.takenAt);

  return (
    <div className="flex flex-col gap-1.5 rounded-md border bg-card px-4 py-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <span className="font-medium text-sm">
          {m.instance_backup_last_label()}
        </span>
        <span className="text-muted-foreground-3 text-sm">
          {days === 0
            ? m.instance_backup_today()
            : m.instance_backup_days_ago({ count: days })}
        </span>
      </div>
      <span className="text-foreground-3 text-sm">
        {fullDateTimeLabel(locale, backup.takenAt)} ·{" "}
        {formatFileSize(locale, backup.bytes)}
      </span>
      {/* Its own line, and the only thing on it: a path is the one string here
          that has no width the box can count on. */}
      <span className="break-all font-mono text-muted-foreground-4 text-xs">
        {backup.archive}
      </span>
      <p className="mt-1 text-muted-foreground-4 text-xs leading-relaxed">
        {m.instance_backup_record_note()}
      </p>
    </div>
  );
}
