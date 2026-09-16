export type FillField<Key extends string> = {
  key: Key;
  locate: (doc: Document) => HTMLInputElement | null;
};

export type SkipReason = "missing" | "readonly";

export type FillOutcome<Key extends string> = {
  filled: { key: Key; value: string }[];
  skipped: { key: Key; reason: SkipReason }[];
};

/**
 * Sets a value the way a keyboard would as far as the portal's framework can
 * tell: through the prototype setter, so React's value tracker notices, then
 * `input` and `change` for React, Angular and on-blur formatters alike.
 */
export function setInputValue(input: HTMLInputElement, value: string): void {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  )?.set;

  input.focus();
  if (setter === undefined) {
    input.value = value;
  } else {
    setter.call(input, value);
  }
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
  input.blur();
}

/** Fills every field the values carry; the rest of the form is never touched. */
export function fillFields<Key extends string>(
  fields: readonly FillField<Key>[],
  values: Partial<Record<Key, number>>,
  doc: Document,
): FillOutcome<Key> {
  const outcome: FillOutcome<Key> = { filled: [], skipped: [] };

  for (const field of fields) {
    const amount = values[field.key];
    if (amount === undefined) {
      continue;
    }
    const input = field.locate(doc);
    if (input === null) {
      outcome.skipped.push({ key: field.key, reason: "missing" });
      continue;
    }
    if (input.disabled || input.readOnly) {
      outcome.skipped.push({ key: field.key, reason: "readonly" });
      continue;
    }
    const value = String(amount);
    setInputValue(input, value);
    outcome.filled.push({ key: field.key, value });
  }

  return outcome;
}
