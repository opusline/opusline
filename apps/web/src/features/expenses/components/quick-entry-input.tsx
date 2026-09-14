import {
  InputGroup,
  InputGroupInput,
} from "@opusline/ui/components/input-group";
import { SparklesIcon } from "lucide-react";

import { m } from "@/paraglide/messages.js";

type QuickEntryInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function QuickEntryInput({ value, onChange }: QuickEntryInputProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-muted-foreground-3 text-sm">
        {m.expenses_quick_hint()}
      </p>
      <InputGroup tone="brand">
        <SparklesIcon
          aria-hidden
          className="size-3.5 shrink-0 text-primary-text"
        />
        <InputGroupInput
          aria-label={m.expenses_quick_aria()}
          className="flex-1"
          onChange={(event) => onChange(event.target.value)}
          placeholder={m.expenses_quick_placeholder()}
          value={value}
        />
      </InputGroup>
    </div>
  );
}
