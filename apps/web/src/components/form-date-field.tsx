import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@opusline/ui/components/field";
import type * as React from "react";

import { DateField } from "@/components/date-field";
import type { StringFieldApi } from "@/components/form-text-field";

type FormDateFieldProps = {
  field: StringFieldApi;
  label: string;
  labelClassName?: string;
  /** Earliest and latest selectable days, inclusive, as `Y-m-d`. */
  min?: string;
  max?: string;
  disabled?: boolean;
  /** Shown under the control while it is valid, replaced by the error when not. */
  description?: React.ReactNode;
  fieldClassName?: string;
};

/**
 * FormTextField's shape for a calendar date — same Field/label/error scaffolding,
 * with the app's own date control instead of a text input.
 */
export function FormDateField({
  field,
  label,
  labelClassName,
  min,
  max,
  disabled,
  description,
  fieldClassName,
}: FormDateFieldProps) {
  const isInvalid = !field.state.meta.isValid;
  const errorId = `${field.name}-error`;
  const descriptionId = `${field.name}-description`;

  return (
    <Field className={fieldClassName} data-invalid={isInvalid}>
      <FieldLabel className={labelClassName} htmlFor={field.name}>
        {label}
      </FieldLabel>
      <DateField
        aria-describedby={
          isInvalid
            ? errorId
            : description === undefined
              ? undefined
              : descriptionId
        }
        aria-invalid={isInvalid}
        disabled={disabled}
        id={field.name}
        max={max}
        min={min}
        onBlur={field.handleBlur}
        onChange={field.handleChange}
        value={field.state.value}
      />
      {isInvalid ? (
        <FieldError errors={field.state.meta.errors} id={errorId} />
      ) : description === undefined ? null : (
        <FieldDescription id={descriptionId}>{description}</FieldDescription>
      )}
    </Field>
  );
}
