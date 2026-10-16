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
  /** Invites to write the first invoice here rather than to record one. */
  writesInOpusline?: boolean;
};

export function InvoicesEmptyState({
  hasInvoices,
  writesInOpusline = false,
}: InvoicesEmptyStateProps) {
  return (
    <Empty className="px-6 py-10">
      <EmptyHeader className="gap-2">
        <EmptyTitle variant="strong">{m.invoices_empty_title()}</EmptyTitle>
        <EmptyDescription className="text-muted-foreground-3 text-sm">
          {hasInvoices
            ? m.invoices_empty_filtered()
            : writesInOpusline
              ? m.invoices_empty_none_opusline()
              : m.invoices_empty_none()}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
