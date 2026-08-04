import { Button } from "@opusline/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@opusline/ui/components/empty";
import { UserPlusIcon } from "lucide-react";

export function ClientsEmptyState() {
  return (
    <Empty className="rounded-md border bg-card py-8">
      <EmptyHeader>
        <EmptyMedia>
          <div
            aria-hidden
            className="flex h-10 w-9 items-center justify-center rounded border border-border/80 border-dashed"
          >
            <UserPlusIcon className="size-4 text-muted-foreground" />
          </div>
        </EmptyMedia>
        <EmptyTitle className="font-heading text-base">
          Créez votre premier client
        </EmptyTitle>
        <EmptyDescription>
          Il porte les coordonnées de facturation et le délai de paiement. Ses
          missions viennent ensuite.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Créer un client</Button>
      </EmptyContent>
    </Empty>
  );
}
