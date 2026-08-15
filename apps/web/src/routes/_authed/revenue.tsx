import { createFileRoute } from "@tanstack/react-router";

import { requireFrenchFiscality } from "@/lib/fiscality";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authed/revenue")({
  beforeLoad: ({ context }) => requireFrenchFiscality(context.user),
  component: RevenusPage,
});

function RevenusPage() {
  return (
    <div>
      <h1 className="font-heading font-semibold text-2xl text-card-foreground">
        {m.nav_revenue()}
      </h1>
      <p className="mt-2 text-muted-foreground text-sm">
        {m.revenue_placeholder()}
      </p>
    </div>
  );
}
