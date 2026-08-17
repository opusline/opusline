import { Checkbox } from "@opusline/ui/components/checkbox";
import { Label } from "@opusline/ui/components/label";
import { useId } from "react";
import { m } from "@/paraglide/messages.js";

type BillableToggleProps = {
  billable: boolean;
  onChange: (billable: boolean) => void;
};

export function BillableToggle({ billable, onChange }: BillableToggleProps) {
  const id = useId();

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={!billable}
        id={id}
        onCheckedChange={(checked) => onChange(!checked)}
      />
      <Label tone="quiet" htmlFor={id}>
        {m.timer_non_billable()}
      </Label>
    </div>
  );
}
