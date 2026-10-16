import { Switch } from "@opusline/ui/components/switch";

export function SwitchRow({
  label,
  checked,
  onChange,
  testId,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  testId: string;
}) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: Base UI's Switch renders a hidden input beside its span, so the wrapping label is its control
    <label className="flex cursor-pointer items-center justify-between gap-4 py-1.5 text-foreground-2 text-sm">
      {label}
      <Switch
        checked={checked}
        data-testid={testId}
        onCheckedChange={onChange}
      />
    </label>
  );
}
