import type { CraCountsData, CraListItemData } from "@opusline/api-client";
import { Input } from "@opusline/ui/components/input";
import { cn } from "@opusline/ui/lib/utils";
import { SearchIcon } from "lucide-react";

import { monthTitle } from "@/lib/months";
import { COLOR_CLASSES } from "@/lib/palette";

import {
  CRA_GROUP_DOT_CLASSES,
  craItemKey,
  groupCras,
} from "../lib/cra-picker";
import {
  CRA_TITLE,
  EYEBROW,
  NO_MATCH,
  SEARCH_PLACEHOLDER,
  toProduceLabel,
} from "../lib/labels";

type CraPickerProps = {
  items: CraListItemData[];
  counts: CraCountsData;
  query: string;
  /** The row currently open, identified the way a row with no id has to be. */
  selectedKey: string | null;
  onQueryChange: (query: string) => void;
  onPick: (item: CraListItemData) => void;
};

export function CraPicker({
  items,
  counts,
  query,
  selectedKey,
  onQueryChange,
  onPick,
}: CraPickerProps) {
  const groups = groupCras(items, query);

  return (
    <aside className="flex w-full shrink-0 flex-col self-stretch lg:w-72">
      <div className="mb-3.5 flex items-baseline justify-between gap-2">
        <span className={EYEBROW}>{CRA_TITLE}</span>
        {counts.toProduce > 0 && (
          <span className="text-primary-text text-xs">
            {toProduceLabel(counts.toProduce)}
          </span>
        )}
      </div>

      <div className="mb-5 flex items-center gap-2.5 rounded-md border px-3 focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/20">
        <SearchIcon
          aria-hidden
          className="size-3.5 shrink-0 text-muted-foreground-3"
        />
        <Input
          aria-label="Rechercher un compte rendu"
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={SEARCH_PLACEHOLDER}
          size="sm"
          surface="bare"
          value={query}
        />
      </div>

      {groups.length === 0 ? (
        <p className="px-2.5 py-4.5 text-center text-muted-foreground-3 text-sm">
          {NO_MATCH}
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {groups.map((group) => (
            <section key={group.key}>
              <div className="flex items-center gap-2 px-0.5 pb-2.75">
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5 rounded-full",
                    CRA_GROUP_DOT_CLASSES[group.key],
                  )}
                />
                <span className={EYEBROW}>{group.label}</span>
                <span className="font-mono text-muted-foreground-4 text-xs tabular-nums">
                  {group.items.length}
                </span>
              </div>

              <ul className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const key = craItemKey(item);

                  return (
                    <li key={key}>
                      <button
                        aria-current={key === selectedKey ? "true" : undefined}
                        className={cn(
                          "flex w-full items-start gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors",
                          "hover:bg-accent focus-visible:bg-accent focus-visible:outline-none",
                          key === selectedKey && "bg-primary/10",
                        )}
                        onClick={() => onPick(item)}
                        type="button"
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "mt-1 h-3.5 w-0.75 shrink-0 rounded-sm",
                            COLOR_CLASSES[item.color],
                          )}
                        />
                        <span className="min-w-0 flex-1">
                          <span
                            className={cn(
                              "block truncate text-sm",
                              key === selectedKey
                                ? "text-foreground-hi"
                                : "text-foreground-3",
                            )}
                          >
                            {item.missionName}
                          </span>
                          <span className="mt-1 block truncate text-muted-foreground-3 text-xs">
                            {item.clientName} · {monthTitle(item.month)}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </aside>
  );
}
