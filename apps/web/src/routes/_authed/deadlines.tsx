import { createFileRoute } from "@tanstack/react-router";

import { requireFrenchFiscality } from "@/lib/fiscality";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authed/deadlines")({
  beforeLoad: ({ context }) => requireFrenchFiscality(context.user),
  component: EcheancesPage,
});

function EcheancesPage() {
  return (
    <div>
      <h1 className="font-heading font-semibold text-2xl text-card-foreground">
        {m.nav_deadlines()}
      </h1>
      <p className="mt-2 text-muted-foreground text-sm">
        {m.deadlines_placeholder()}
      </p>
    </div>
  );
}
