import type { DocumentGroupData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { Button } from "@opusline/ui/components/button";
import { cn } from "@opusline/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowRightIcon, ChevronRightIcon } from "lucide-react";

import { DocumentDownloadButton, DocumentRow } from "@/components/document-row";
import { useLocale } from "@/components/money-format-provider";
import { fullDateLabel } from "@/lib/dates";
import { COLOR_CLASSES } from "@/lib/palette";
import { m } from "@/paraglide/messages.js";

import {
  groupKindLabel,
  isMissionGroup,
  libraryDownloadHref,
} from "../lib/library";

type DocumentGroupProps = {
  group: DocumentGroupData;
  isOpen: boolean;
  onToggle: () => void;
};

export function DocumentGroup({ group, isOpen, onToggle }: DocumentGroupProps) {
  const locale = useLocale();

  return (
    <div className="overflow-hidden rounded-md border bg-card">
      <button
        aria-expanded={isOpen}
        aria-label={m.documents_toggle_group({ name: group.name })}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
        onClick={onToggle}
        type="button"
      >
        <ChevronRightIcon
          aria-hidden
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground-4 transition-transform",
            isOpen && "rotate-90",
          )}
        />
        <span
          aria-hidden
          className={cn(
            "size-2.5 shrink-0 rounded-sm",
            COLOR_CLASSES[group.color],
          )}
        />
        <span className="min-w-0 truncate text-foreground-hi text-sm">
          {group.name}
        </span>
        <Badge variant="quiet">{groupKindLabel(group)}</Badge>
        <span className="flex-1" />
        <span className="hidden text-muted-foreground-3 text-xs sm:inline">
          {m.documents_library_last_added({
            date: fullDateLabel(locale, group.lastAddedAt),
          })}
        </span>
        <span className="font-mono text-muted-foreground-2 text-xs tabular-nums">
          <span aria-hidden>{group.documents.length}</span>
          <span className="sr-only">
            {m.documents_group_count({ count: group.documents.length })}
          </span>
        </span>
      </button>

      {isOpen && (
        <>
          <div className="divide-y border-t">
            {group.documents.map((document) => (
              <DocumentRow document={document} key={document.id}>
                <DocumentDownloadButton
                  document={document}
                  href={libraryDownloadHref(group, document)}
                />
              </DocumentRow>
            ))}
          </div>
          <div className="flex items-center border-t bg-muted px-4 py-3">
            <Button
              render={
                isMissionGroup(group) ? (
                  <Link
                    params={{
                      clientSlug: group.clientSlug,
                      missionSlug: group.missionSlug,
                    }}
                    search={{ tab: "documents" }}
                    to="/clients/$clientSlug/missions/$missionSlug"
                  />
                ) : (
                  <Link
                    params={{ clientSlug: group.clientSlug }}
                    search={{ tab: "documents" }}
                    to="/clients/$clientSlug"
                  />
                )
              }
              variant="ghost"
            >
              {m.documents_open_fiche()}
              <ArrowRightIcon aria-hidden data-icon="inline-end" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
