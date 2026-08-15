import { Badge } from "@opusline/ui/components/badge";
import { Button } from "@opusline/ui/components/button";
import { Info } from "lucide-react";

import { useLocale } from "@/components/money-format-provider";
import { calendarDateLabel } from "@/lib/dates";
import {
  RELEASE_KIND_CLASSES,
  releaseKindLabel,
  releaseTypeLabel,
} from "@/lib/release-labels";
import { RELEASES, unreadReleaseCount } from "@/lib/releases";
import { APP_VERSION } from "@/lib/version";
import { isReleaseUnread, releaseType } from "@/lib/versions";
import { m } from "@/paraglide/messages.js";

type ReleaseNotesPageProps = {
  seenVersion: string | null;
  isMarking: boolean;
  onMarkRead: () => void;
};

export function ReleaseNotesPage({
  seenVersion,
  isMarking,
  onMarkRead,
}: ReleaseNotesPageProps) {
  const locale = useLocale();
  const unreadCount = unreadReleaseCount(seenVersion);

  return (
    <div className="max-w-[51.25rem]">
      <div className="mb-1.5 flex flex-wrap items-end justify-between gap-5">
        <h1 className="font-heading font-semibold text-2xl text-foreground-hi">
          {m.release_notes_title()}
        </h1>
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-muted-foreground-2 text-sm">
            v{APP_VERSION}
          </span>
          <span className="text-muted-foreground-3 text-xs">
            {m.release_notes_installed()}
          </span>
        </div>
      </div>
      <p className="mb-5 max-w-prose text-muted-foreground-3 text-pretty text-sm">
        {m.release_notes_intro()}
      </p>

      {unreadCount > 0 && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-md border border-primary/30 bg-primary/6 px-5 py-3.5">
          <div>
            <p className="text-primary-text text-sm">
              {m.release_notes_unread_title({ count: unreadCount })}
            </p>
            {seenVersion !== null && (
              <p className="mt-1 font-mono text-muted-foreground-3 text-xs">
                v{seenVersion} → v{APP_VERSION}
              </p>
            )}
          </div>
          <Button
            disabled={isMarking}
            onClick={onMarkRead}
            size="xl"
            variant="brand-outline"
          >
            {m.release_notes_mark_read()}
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-3.5">
        {RELEASES.map((release) => (
          <section className="rounded-md border bg-card" key={release.version}>
            <div className="flex flex-wrap items-center gap-3 border-b px-5 py-4">
              <span className="font-medium font-mono text-base text-foreground-hi">
                v{release.version}
              </span>
              <Badge variant="quiet">
                {releaseTypeLabel(releaseType(release.version))}
              </Badge>
              {isReleaseUnread(release.version, seenVersion) && (
                <Badge className="uppercase" variant="brand-solid">
                  {m.release_notes_unread_badge()}
                </Badge>
              )}
              <span className="ml-auto whitespace-nowrap text-muted-foreground-3 text-xs">
                {calendarDateLabel(locale, release.date)}
              </span>
            </div>
            <div className="px-5 pt-4 pb-5">
              {release.headline && (
                <p className="mb-4 max-w-prose text-muted-foreground text-pretty text-sm leading-relaxed">
                  {release.headline}
                </p>
              )}
              <div className="flex flex-col gap-3">
                {release.items.map((item) => (
                  <div
                    className="grid grid-cols-[5.75rem_minmax(0,1fr)] items-baseline gap-3.5"
                    key={item.text}
                  >
                    <span
                      className={`font-medium text-xs uppercase tracking-wider-2 ${RELEASE_KIND_CLASSES[item.kind]}`}
                    >
                      {releaseKindLabel(item.kind)}
                    </span>
                    <span className="text-foreground-3 text-pretty text-sm leading-relaxed">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-md border bg-muted px-5 py-4">
        <Info className="size-4 shrink-0 text-muted-foreground-2" />
        <p className="text-muted-foreground-3 text-sm">
          {m.release_notes_repo_note()}
        </p>
      </div>
    </div>
  );
}
