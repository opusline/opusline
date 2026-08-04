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
import { UserPlusIcon } from "lucide-react";

export function ClientsEmptyState() {
  return (
    <Empty className="rounded-md border border-solid bg-card px-7 py-8">
      <EmptyHeader className="max-w-none gap-2">
        <EmptyMedia className="mb-2.5">
          <div
            aria-hidden
            className="flex h-11 w-10 items-center justify-center rounded border border-border-4 border-dashed"
          >
            <UserPlusIcon
              className="size-4 text-muted-foreground-3"
              strokeWidth={1.8}
            />
          </div>
        </EmptyMedia>
        <EmptyTitle className="font-heading font-semibold text-base text-foreground-hi">
          Créez votre premier client
        </EmptyTitle>
        <EmptyDescription className="text-muted-foreground-3">
          Il porte les coordonnées de facturation et le délai de paiement. Ses
          missions viennent ensuite.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button render={<Link to="/clients/new" />} size="2xl">
          Créer un client
        </Button>
      </EmptyContent>
    </Empty>
  );
}
