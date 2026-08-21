import type { DocumentCategory } from "@opusline/api-client";
import { Chip, ChipCount, ChipGroup } from "@opusline/ui/components/chip";
import { SearchIcon } from "lucide-react";

import {
  DOCUMENT_CATEGORIES,
  type DocumentCategoryFilter,
  documentCategoryLabel,
  isDocumentCategory,
} from "@/lib/documents";
import { m } from "@/paraglide/messages.js";

type DocumentFilterBarProps = {
  search: string;
  onSearchChange: (search: string) => void;
  filter: DocumentCategoryFilter;
  onFilterChange: (filter: DocumentCategoryFilter) => void;
  counts: Record<DocumentCategory, number>;
  total: number;
  searchPlaceholder: string;
};

/** Search pill plus one chip per category present, shared by every document list. */
export function DocumentFilterBar({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  counts,
  total,
  searchPlaceholder,
}: DocumentFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="flex h-8 min-w-47.5 max-w-70 flex-1 items-center gap-2.5 rounded-full border border-border-2 bg-muted px-3 transition-colors focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/20">
        <SearchIcon
          aria-hidden
          className="size-3.25 shrink-0 text-muted-foreground-5"
        />
        <input
          aria-label={m.documents_search_aria()}
          className="min-w-0 flex-1 bg-transparent text-foreground-hi text-sm outline-none placeholder:text-muted-foreground-5"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          value={search}
        />
      </span>
      <ChipGroup
        aria-label={m.documents_filter_aria()}
        onValueChange={(value) => {
          const [next] = value;

          if (next === "all") {
            onFilterChange("all");
            return;
          }

          const category = Number(next);
          if (isDocumentCategory(category)) {
            onFilterChange(category);
          }
        }}
        value={[filter === "all" ? "all" : String(filter)]}
      >
        <Chip
          aria-label={`${m.common_all()} (${total})`}
          shape="pill"
          value="all"
        >
          {m.common_all()}
          <ChipCount aria-hidden>{total}</ChipCount>
        </Chip>
        {DOCUMENT_CATEGORIES.filter((category) => counts[category] > 0).map(
          (category) => (
            <Chip
              aria-label={`${documentCategoryLabel(category)} (${counts[category]})`}
              key={category}
              shape="pill"
              value={String(category)}
            >
              {documentCategoryLabel(category)}
              <ChipCount aria-hidden>{counts[category]}</ChipCount>
            </Chip>
          ),
        )}
      </ChipGroup>
    </div>
  );
}
