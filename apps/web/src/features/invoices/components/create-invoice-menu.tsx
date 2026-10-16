import type { InvoicingMode } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { Button } from "@opusline/ui/components/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@opusline/ui/components/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@opusline/ui/components/dropdown-menu";
import { ChevronDown, PlusIcon } from "lucide-react";

import { m } from "@/paraglide/messages.js";

type CreateInvoiceMenuProps = {
  /** Where the account writes its invoices: that way is the button's own. */
  mode: InvoicingMode;
  onCreate: () => void;
  onAddElsewhere: () => void;
};

/**
 * « Créer » as the settings' default action, the other one a click away in
 * its menu, for the invoice that does not follow the habit.
 */
export function CreateInvoiceMenu({
  mode,
  onCreate,
  onAddElsewhere,
}: CreateInvoiceMenuProps) {
  const writesHere = mode === 0;
  const options = [
    {
      kind: "opusline",
      label: m.invoices_create_in_opusline(),
      detail: m.invoices_create_in_opusline_detail(),
      isDefault: writesHere,
      go: onCreate,
    },
    {
      kind: "elsewhere",
      label: m.invoices_create_elsewhere(),
      detail: m.invoices_create_elsewhere_detail(),
      isDefault: !writesHere,
      go: onAddElsewhere,
    },
  ];

  return (
    <ButtonGroup aria-label={m.invoices_create_invoice()}>
      <Button
        data-kind={writesHere ? "opusline" : "elsewhere"}
        data-testid="invoice-create"
        onClick={writesHere ? onCreate : onAddElsewhere}
        size="xl"
      >
        <PlusIcon aria-hidden />
        {writesHere ? m.invoices_create_invoice() : m.invoices_add_title()}
      </Button>
      <ButtonGroupSeparator />
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              aria-label={m.invoices_create_other()}
              data-testid="invoice-create-menu"
              size="icon-xl"
            >
              <ChevronDown />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-80" sideOffset={6}>
          {options.map((option) => (
            <DropdownMenuItem
              data-kind={option.kind}
              data-testid="invoice-create-item"
              key={option.kind}
              onClick={option.go}
            >
              <span className="flex flex-col gap-0.5">
                <span className="flex items-center gap-2">
                  {option.label}
                  {option.isDefault ? (
                    <Badge variant="quiet">{m.invoices_create_default()}</Badge>
                  ) : null}
                </span>
                <span className="text-muted-foreground text-xs">
                  {option.detail}
                </span>
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
