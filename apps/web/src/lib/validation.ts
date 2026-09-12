export type FieldErrorMap = Record<string, { message: string }>;

/**
 * What the api client stamps on a refused request's body before throwing it:
 * the status, the verb and the unresolved route template (`/clients/{client}`,
 * never an id).
 */
export type ApiErrorStamp = { status: number; method: string; route: string };

/** The HTTP status the api client stamped on a thrown error, if it came from a response. */
export function serverStatus(error: unknown): number | null {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number"
  ) {
    return error.status;
  }

  return null;
}

/** The request the api client stamped on a thrown error, if it came from a response. */
export function serverRequest(
  error: unknown,
): Pick<ApiErrorStamp, "method" | "route"> | null {
  if (
    typeof error === "object" &&
    error !== null &&
    "method" in error &&
    "route" in error &&
    typeof error.method === "string" &&
    typeof error.route === "string"
  ) {
    return { method: error.method, route: error.route };
  }

  return null;
}

/**
 * Whether a thrown value is a refused request rather than a crash: the whole
 * stamp must be there, so an unrelated `{ status: 500 }` is not mistaken for one.
 */
export function isApiClientError(error: unknown): boolean {
  return serverStatus(error) !== null && serverRequest(error) !== null;
}

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
