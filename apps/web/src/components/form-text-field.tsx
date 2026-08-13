import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@opusline/ui/components/field";
import { Input } from "@opusline/ui/components/input";
import { Textarea } from "@opusline/ui/components/textarea";
import type * as React from "react";

export type StringFieldApi = {
  name: string;
  state: {
    value: string;
    meta: {
      isTouched: boolean;
      isValid: boolean;
      errors: Array<{ message?: string } | undefined>;
    };
  };
  handleChange: (value: string) => void;
  handleBlur: () => void;
};

type FormTextFieldProps = {
  field: StringFieldApi;
  label: string;
  labelClassName?: string;
  multiline?: boolean;
  inputClassName?: string;
  font?: "sans" | "mono";
  type?: string;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  disabled?: boolean;
  /** Shown under the control while it is valid, replaced by the error when not. */
  description?: React.ReactNode;
  /** Unit or symbol pinned inside the trailing edge of the control. */
  adornment?: string;
  fieldClassName?: string;
  /** Id of extra text describing the control, announced after the description. */
  describedBy?: string;
};

export function FormTextField({
  field,
  label,
  labelClassName,
  multiline = false,
  inputClassName,
  font,
  type,
  placeholder,
  inputMode,
  disabled,
  description,
  adornment,
  fieldClassName,
  describedBy,
}: FormTextFieldProps) {
  const isInvalid = !field.state.meta.isValid;
  const errorId = `${field.name}-error`;
  const descriptionId = `${field.name}-description`;

  const hint = isInvalid
    ? errorId
    : description === undefined
      ? undefined
      : descriptionId;

  const controlProps = {
    "aria-invalid": isInvalid,
    "aria-describedby":
      [hint, describedBy].filter(Boolean).join(" ") || undefined,
    className: inputClassName,
    disabled,
    id: field.name,
    inputMode,
    onBlur: field.handleBlur,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => field.handleChange(event.target.value),
    placeholder,
    value: field.state.value,
  };

  const control = multiline ? (
    <Textarea {...controlProps} />
  ) : (
    <Input {...controlProps} font={font} type={type} />
  );

  return (
    <Field className={fieldClassName} data-invalid={isInvalid}>
      <FieldLabel className={labelClassName} htmlFor={field.name}>
        {label}
      </FieldLabel>
      {adornment === undefined ? (
        control
      ) : (
        <div className="relative">
          {control}
          <span className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-3 text-muted-foreground-2 text-sm">
            {adornment}
          </span>
        </div>
      )}
      {isInvalid ? (
        <FieldError errors={field.state.meta.errors} id={errorId} />
      ) : description === undefined ? null : (
        <FieldDescription id={descriptionId}>{description}</FieldDescription>
      )}
    </Field>
  );
}
