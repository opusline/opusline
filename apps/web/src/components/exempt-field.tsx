import { Field } from "@opusline/ui/components/field";

type ExemptFieldProps = {
  label: string;
  /** Why the control is absent — the rule, not an instruction to the user. */
  reason: string;
  labelClassName?: string;
};

/**
 * A field whose control does not apply, with the reason standing in its place.
 *
 * Field rather than a bare div so the label keeps the same baseline as the real
 * fields it stands among, and a plain span rather than FieldLabel because there
 * is no control here for a label to point at.
 */
export function ExemptField({
  label,
  reason,
  labelClassName,
}: ExemptFieldProps) {
  return (
    <Field>
      <span className={labelClassName}>{label}</span>
      <div className="flex h-10 items-center rounded-md border border-border-3 border-dashed bg-muted px-3 text-muted-foreground-3 text-sm">
        {reason}
      </div>
    </Field>
  );
}
