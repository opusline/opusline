import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/revenus")({
  component: RevenusPage,
});

function RevenusPage() {
  return (
    <div>
      <h1 className="font-heading font-semibold text-2xl text-card-foreground">
        Revenus
      </h1>
      <p className="mt-2 text-muted-foreground text-sm">
        Le suivi des revenus arrive ici — CA facturé, TVA collectée, net estimé.
      </p>
    </div>
  );
}
