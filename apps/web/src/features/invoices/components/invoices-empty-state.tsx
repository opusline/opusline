import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@opusline/ui/components/empty";

import { m } from "@/paraglide/messages.js";

type InvoicesEmptyStateProps = {
  /** Distinguishes "nothing matches this filter" from "nothing tracked yet". */
  hasInvoices: boolean;
};

export function InvoicesEmptyState({ hasInvoices }: InvoicesEmptyStateProps) {
  return (
    <Empty className="rounded-md border border-solid bg-card px-6 py-10">
      <EmptyHeader className="gap-2">
        <EmptyTitle className="font-heading font-semibold text-base text-foreground-hi">
          {m.invoices_empty_title()}
        </EmptyTitle>
        <EmptyDescription className="text-muted-foreground-3 text-sm">
          {hasInvoices ? m.invoices_empty_filtered() : m.invoices_empty_none()}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
