import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/declarations")({
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
