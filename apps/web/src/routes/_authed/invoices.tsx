import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * The invoices list moved into the Facturation section; links and bookmarks to
 * the old address, including a fiche deep link, keep working.
 */
export const Route = createFileRoute("/_authed/invoices")({
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/invoicing/invoices", search, replace: true });
  },
  validateSearch: (search: Record<string, unknown>): { invoice?: number } => {
    const invoice = Number(search.invoice);

    return Number.isInteger(invoice) && invoice > 0 ? { invoice } : {};
  },
});
