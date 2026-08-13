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
    <Empty className="rounded-md border border-solid bg-card px-6 py-10">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileCheckIcon />
        </EmptyMedia>
        <EmptyTitle>Aucune mission ne demande de CRA</EmptyTitle>
        <EmptyDescription>
          Activez « CRA mensuel requis » sur une mission facturée à la journée :
          ses mois viendront s'empiler ici.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={onGoToClients} size="2xl">
          Ouvrir mes clients
        </Button>
      </EmptyContent>
    </Empty>
  );
}
