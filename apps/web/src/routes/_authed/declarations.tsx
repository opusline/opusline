import { createFileRoute } from "@tanstack/react-router";

import { requireFrenchFiscality } from "@/lib/fiscality";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authed/declarations")({
  beforeLoad: ({ context }) => requireFrenchFiscality(context.user),
  component: DeclarationsPage,
});

function DeclarationsPage() {
  return (
    <div>
      <h1 className="font-heading font-semibold text-2xl text-card-foreground">
        {m.nav_declarations()}
      </h1>
      <p className="mt-2 text-muted-foreground text-sm">
        {m.declarations_placeholder()}
      </p>
    </div>
  );
}
