import { Button } from "@opusline/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@opusline/ui/components/empty";
import { FileCheckIcon } from "lucide-react";

import { m } from "@/paraglide/messages.js";

/**
 * Shown when the list comes back empty, which can only mean one thing: no mission asks
 * for a CRA.
 *
 * An active mission that does contributes the current month whether or not any time is
 * logged against it, so "has CRA missions but nothing to produce" is not a state the
 * API can put us in.
 */
export function CraEmptyState({
  onGoToClients,
}: {
  onGoToClients: () => void;
}) {
  return (
    <Empty className="px-6 py-10">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileCheckIcon />
        </EmptyMedia>
        <EmptyTitle>{m.cra_empty_title()}</EmptyTitle>
        <EmptyDescription>{m.cra_empty_description()}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={onGoToClients} size="2xl">
          {m.cra_empty_open_clients()}
        </Button>
      </EmptyContent>
    </Empty>
  );
}
