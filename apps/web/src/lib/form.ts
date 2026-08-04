export type FormSubmitResult =
  | { status: "success" }
  | { status: "invalid"; fieldErrors: Record<string, { message: string }> }
  | { status: "failed" };
