import { createFileRoute } from "@tanstack/react-router";

import { requireFrenchFiscality } from "@/lib/fiscality";

export const Route = createFileRoute("/_authed/declarations")({
  beforeLoad: ({ context }) => requireFrenchFiscality(context.user),
  component: DeclarationsPage,
});

function DeclarationsPage() {
  return (
    <div>
      <h1 className="font-heading font-semibold text-2xl text-card-foreground">
        Déclarations
      </h1>
      <p className="mt-2 text-muted-foreground text-sm">
        Les aides à la déclaration arrivent ici — URSSAF et TVA, chiffres prêts
        à copier.
      </p>
    </div>
  );
}
