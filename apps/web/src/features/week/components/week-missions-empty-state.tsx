import { Button } from "@opusline/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@opusline/ui/components/empty";
import { Link } from "@tanstack/react-router";
import { CalendarIcon } from "lucide-react";

export function WeekMissionsEmptyState() {
  return (
    <Empty className="rounded-md border border-solid bg-card px-8 py-11">
      <EmptyHeader className="max-w-none gap-2">
        <EmptyMedia className="mb-2.5">
          <div
            aria-hidden
            className="flex h-10.5 w-9.5 items-center justify-center rounded border border-border-4 border-dashed"
          >
            <CalendarIcon
              className="size-4 text-muted-foreground-3"
              strokeWidth={1.8}
            />
          </div>
        </EmptyMedia>
        <EmptyTitle className="font-heading font-semibold text-base text-foreground-hi">
          Rien à suivre pour l'instant
        </EmptyTitle>
        <EmptyDescription className="max-w-[46ch] text-muted-foreground-3">
          La grille affiche une ligne par mission. Créez un client, puis sa
          première mission, et la semaine se remplit à la saisie.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row flex-wrap justify-center gap-2">
        <Button render={<Link to="/clients/new" />} size="2xl">
          Créer un client
        </Button>
        <Button render={<Link to="/clients" />} size="2xl" variant="outline">
          Voir mes clients
        </Button>
      </EmptyContent>
    </Empty>
  );
}
