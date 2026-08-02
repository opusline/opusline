import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/echeances")({
  component: EcheancesPage,
});

function EcheancesPage() {
  return (
    <div>
      <h1 className="font-heading font-semibold text-2xl text-card-foreground">
        Échéances
      </h1>
      <p className="mt-2 text-muted-foreground text-sm">
        Les échéances arrivent ici — URSSAF, CA3, CFE, rappels.
      </p>
    </div>
  );
}
