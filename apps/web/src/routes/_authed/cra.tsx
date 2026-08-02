import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/cra")({
  component: CraPage,
});

function CraPage() {
  return (
    <div>
      <h1 className="font-heading font-semibold text-2xl text-card-foreground">
        Compte rendu d'activité
      </h1>
      <p className="mt-2 text-muted-foreground text-sm">
        Le CRA mensuel arrive ici — grille des jours travaillés, export PDF.
      </p>
    </div>
  );
}
