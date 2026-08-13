export type FormSubmitResult =
  | { status: "success" }
  | { status: "invalid"; fieldErrors: Record<string, { message: string }> }
  | { status: "failed" };

/** Empty text is an absent value in an API payload, not an empty string. */
export function valueOrNull(value: string): string | null {
  const trimmed = value.trim();

  return trimmed === "" ? null : trimmed;
}
