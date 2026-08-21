import type { DocumentGroupData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { cn } from "@opusline/ui/lib/utils";
import { useMemo, useState } from "react";

import { DocumentFilterBar } from "@/components/document-filter-bar";
import { DocumentDownloadButton, DocumentRow } from "@/components/document-row";
import { countByCategory, type DocumentCategoryFilter } from "@/lib/documents";
import { COLOR_CLASSES } from "@/lib/palette";
import { m } from "@/paraglide/messages.js";

import {
  filterGroups,
  groupKey,
  libraryDocuments,
  libraryDownloadHref,
  searchLibrary,
} from "../lib/library";
import { DocumentGroup } from "./document-group";
import { DocumentsSectionHeading } from "./documents-section-heading";

type DocumentLibrarySectionProps = {
  groups: DocumentGroupData[];
};

export function DocumentLibrarySection({
  groups,
}: DocumentLibrarySectionProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<DocumentCategoryFilter>("all");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const allDocuments = useMemo(() => libraryDocuments(groups), [groups]);
  const counts = useMemo(() => countByCategory(allDocuments), [allDocuments]);
  const visibleGroups = useMemo(
    () => filterGroups(groups, filter),
    [groups, filter],
  );
  const hits = useMemo(
    () => searchLibrary(visibleGroups, search),
    [visibleGroups, search],
  );

  const heading = (
    <DocumentsSectionHeading>
      {m.documents_library_heading()}
    </DocumentsSectionHeading>
  );

  if (allDocuments.length === 0) {
    return (
      <section className="flex flex-col gap-3.5">
        {heading}
        <p className="rounded-md border bg-card px-5 py-7 text-center text-muted-foreground-3 text-sm">
          {m.documents_library_empty()}
        </p>
      </section>
    );
  }

  const results =
    search.trim() !== "" ? (
      hits.length > 0 ? (
        <div className="divide-y overflow-hidden rounded-md border bg-card">
          {hits.map(({ group, document }) => (
            <DocumentRow
              badges={
                <Badge variant="quiet">
                  <span
                    aria-hidden
                    className={cn(
                      "size-2 shrink-0 rounded-xs",
                      COLOR_CLASSES[group.color],
                    )}
                  />
                  {group.name}
                </Badge>
              }
              document={document}
              key={`${groupKey(group)}#${document.id}`}
            >
              <DocumentDownloadButton
                document={document}
                href={libraryDownloadHref(group, document)}
              />
            </DocumentRow>
          ))}
        </div>
      ) : (
        <p className="rounded-md border bg-card px-5 py-7 text-center text-muted-foreground-3 text-sm">
          {m.documents_no_match()}
        </p>
      )
    ) : (
      <div className="flex flex-col gap-2">
        {visibleGroups.map((group) => {
          const key = groupKey(group);

          return (
            <DocumentGroup
              group={group}
              isOpen={openGroups[key] ?? false}
              key={key}
              onToggle={() =>
                setOpenGroups((current) => ({
                  ...current,
                  [key]: !(current[key] ?? false),
                }))
              }
            />
          );
        })}
      </div>
    );

  return (
    <section className="flex flex-col gap-3.5">
      {heading}
      <DocumentFilterBar
        counts={counts}
        filter={filter}
        onFilterChange={setFilter}
        onSearchChange={setSearch}
        search={search}
        searchPlaceholder={m.documents_library_search_placeholder()}
        total={allDocuments.length}
      />
      {results}
    </section>
  );
}
