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

/**
 * The banner message for a refused write, or null when there is nothing for a
 * banner to say.
 *
 * Field errors belong on the fields, so a 422 yields null; a 404/409 carries
 * only `{ message }`, and that message is the whole explanation.
 */
export function writeErrorBanner(
  error: unknown,
  fallback: string,
): string | null {
  if (error === null || error === undefined || serverFieldErrors(error)) {
    return null;
  }

  return serverErrorMessage(error, fallback);
}

/**
 * The message to show for a refused write. Laravel sends `{ errors }` for a 422
 * and a bare `{ message }` for 404/409, and both are worth surfacing verbatim —
 * they are already localized server-side.
 */
export function serverErrorMessage(error: unknown, fallback: string): string {
  const field = Object.values(serverFieldErrors(error) ?? {})[0]?.message;

  if (field !== undefined) {
    return field;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return fallback;
}
