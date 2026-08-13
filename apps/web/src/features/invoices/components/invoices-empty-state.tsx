import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@opusline/ui/components/empty";

type InvoicesEmptyStateProps = {
  /** Distinguishes "nothing matches this filter" from "nothing tracked yet". */
  hasInvoices: boolean;
};

export function InvoicesEmptyState({ hasInvoices }: InvoicesEmptyStateProps) {
  return (
    <Empty className="rounded-md border border-solid bg-card px-6 py-10">
      <EmptyHeader className="gap-2">
        <EmptyTitle className="font-heading font-semibold text-base text-foreground-hi">
          Aucune facture ici
        </EmptyTitle>
        <EmptyDescription className="text-muted-foreground-3 text-sm">
          {hasInvoices
            ? "Changez de filtre, ou ajoutez une facture émise ailleurs."
            : "Les factures sont éditées ailleurs. Ajoutez-en une pour suivre ce qui est facturé et ce qui est encaissé."}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
