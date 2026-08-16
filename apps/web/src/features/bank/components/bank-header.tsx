import { Button } from "@opusline/ui/components/button";
import { DownloadIcon } from "lucide-react";

import { m } from "@/paraglide/messages.js";

type BankHeaderProps = {
  onImport: () => void;
};

export function BankHeader({ onImport }: BankHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-5">
      <div className="min-w-0">
        <h1 className="font-heading font-semibold text-2xl text-foreground-hi">
          {m.bank_title()}
        </h1>
        <p className="mt-1 max-w-[62ch] text-pretty text-muted-foreground-3 text-sm">
          {m.bank_intro()}
        </p>
      </div>
      <Button onClick={onImport} size="xl">
        <DownloadIcon aria-hidden data-icon="inline-start" />
        {m.bank_import_button()}
      </Button>
    </div>
  );
}
