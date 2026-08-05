import { Field, FieldError, FieldLabel } from "@opusline/ui/components/field";
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
}: FormTextFieldProps) {
  const isInvalid = !field.state.meta.isValid;

  const controlProps = {
    "aria-invalid": isInvalid,
    className: inputClassName,
    id: field.name,
    onBlur: field.handleBlur,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => field.handleChange(event.target.value),
    placeholder,
    value: field.state.value,
  };

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel className={labelClassName} htmlFor={field.name}>
        {label}
      </FieldLabel>
      {multiline ? (
        <Textarea {...controlProps} />
      ) : (
        <Input {...controlProps} font={font} type={type} />
      )}
      {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
    </Field>
  );
}
