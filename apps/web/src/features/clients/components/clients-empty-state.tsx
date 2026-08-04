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
    <Empty className="rounded-md border border-solid bg-card px-6.5 py-7.5">
      <EmptyHeader className="max-w-none gap-1.5">
        <EmptyMedia className="mb-2.5">
          <div
            aria-hidden
            className="flex h-10.5 w-9.5 items-center justify-center rounded border border-muted-foreground/30 border-dashed"
          >
            <UserPlusIcon
              className="size-4 text-muted-foreground"
              strokeWidth={1.8}
            />
          </div>
        </EmptyMedia>
        <EmptyTitle className="font-heading font-semibold text-lg">
          Créez votre premier client
        </EmptyTitle>
        <EmptyDescription>
          Il porte les coordonnées de facturation et le délai de paiement. Ses
          missions viennent ensuite.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="xl">Créer un client</Button>
      </EmptyContent>
    </Empty>
  );
}
