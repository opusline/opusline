type FieldErrorMap = Record<string, { message: string }>;

/**
 * Extracts Laravel's 422 validation body ({ message, errors: { field: [msgs] } })
 * from a thrown api-client error.
 */
export function serverFieldErrors(error: unknown): FieldErrorMap | null {
  if (typeof error !== "object" || error === null || !("errors" in error)) {
    return null;
  }

  const errors = (error as { errors: unknown }).errors;
  if (typeof errors !== "object" || errors === null) {
    return null;
  }

  const fields: FieldErrorMap = {};
  for (const [field, messages] of Object.entries(errors)) {
    if (Array.isArray(messages) && typeof messages[0] === "string") {
      fields[field] = { message: messages[0] };
    }
  }

  return Object.keys(fields).length > 0 ? fields : null;
}
