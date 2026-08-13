type InvoicesEmptyStateProps = {
  /** Distinguishes "nothing matches this filter" from "nothing tracked yet". */
  hasInvoices: boolean;
};

export function InvoicesEmptyState({ hasInvoices }: InvoicesEmptyStateProps) {
  return (
    <div className="rounded-md border bg-card px-6 py-10 text-center">
      <p className="font-heading font-semibold text-base text-foreground-hi">
        Aucune facture ici
      </p>
      <p className="mt-1.5 text-muted-foreground-3 text-sm">
        {hasInvoices
          ? "Changez de filtre, ou ajoutez une facture émise ailleurs."
          : "Les factures sont éditées ailleurs. Ajoutez-en une pour suivre ce qui est facturé et ce qui est encaissé."}
      </p>
    </div>
  );
}
