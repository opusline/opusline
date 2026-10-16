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

/** Each document's two ways in, as the design names them. */
const COPY = {
  invoice: {
    group: m.invoices_create_invoice,
    create: m.invoices_create_invoice,
    add: m.invoices_add_title,
    other: m.invoices_create_other,
    inOpusline: m.invoices_create_in_opusline,
    inOpuslineDetail: m.invoices_create_in_opusline_detail,
    elsewhere: m.invoices_create_elsewhere,
    elsewhereDetail: m.invoices_create_elsewhere_detail,
  },
  quote: {
    group: m.quotes_create,
    create: m.quotes_create,
    add: m.quotes_create_elsewhere,
    other: m.quotes_create_other,
    inOpusline: m.quotes_create_in_opusline,
    inOpuslineDetail: m.quotes_create_in_opusline_detail,
    elsewhere: m.quotes_create_elsewhere,
    elsewhereDetail: m.quotes_create_elsewhere_detail,
  },
};

type CreateDocumentMenuProps = {
  document: keyof typeof COPY;
  /** Where the account writes its documents: that way is the button's own. */
  mode: InvoicingMode;
  onCreate: () => void;
  onAddElsewhere: () => void;
};

/**
 * « Créer » as the settings' default action, the other one a click away in
 * its menu, for the document that does not follow the habit.
 */
export function CreateDocumentMenu({
  document,
  mode,
  onCreate,
  onAddElsewhere,
}: CreateDocumentMenuProps) {
  const copy = COPY[document];
  const writesHere = mode === 0;
  const options = [
    {
      kind: "opusline",
      label: copy.inOpusline(),
      detail: copy.inOpuslineDetail(),
      isDefault: writesHere,
      go: onCreate,
    },
    {
      kind: "elsewhere",
      label: copy.elsewhere(),
      detail: copy.elsewhereDetail(),
      isDefault: !writesHere,
      go: onAddElsewhere,
    },
  ];

  return (
    <ButtonGroup aria-label={copy.group()}>
      <Button
        data-kind={writesHere ? "opusline" : "elsewhere"}
        data-testid={`${document}-create`}
        onClick={writesHere ? onCreate : onAddElsewhere}
        size="xl"
      >
        <PlusIcon aria-hidden />
        {writesHere ? copy.create() : copy.add()}
      </Button>
      <ButtonGroupSeparator />
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              aria-label={copy.other()}
              data-testid={`${document}-create-menu`}
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
              data-testid={`${document}-create-item`}
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
