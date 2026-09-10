import type {
  LoginResponse,
  TwoFactorChallengeData,
} from "@opusline/api-client";

import {
  serverErrorMessage,
  serverFieldErrors,
  serverStatus,
} from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

/** POST /login answers 200 with the user or 202 with the challenge; only the body tells them apart. */
export function isTwoFactorChallenge(
  response: LoginResponse,
): response is TwoFactorChallengeData {
  return "twoFactorRequired" in response;
}

export type ChallengeFailure =
  | { status: "invalid"; field: "code" | "recoveryCode"; message: string }
  | { status: "expired"; message: string }
  | { status: "throttled"; message: string }
  | { status: "failed" };

/**
 * A 422 names the field that was wrong; a 409 means the pending login is gone
 * (expired, or discarded after too many misses — the message says which) and
 * the password step is the only way forward; a 429 is the limiter.
 */
export function classifyChallengeError(error: unknown): ChallengeFailure {
  const fieldErrors = serverFieldErrors(error);
  const code = fieldErrors?.code ?? null;
  const recoveryCode = fieldErrors?.recoveryCode ?? null;

  if (code !== null) {
    return { status: "invalid", field: "code", message: code.message };
  }

  if (recoveryCode !== null) {
    return {
      status: "invalid",
      field: "recoveryCode",
      message: recoveryCode.message,
    };
  }

  switch (serverStatus(error)) {
    case 409:
      return {
        status: "expired",
        message: serverErrorMessage(error, m.auth_two_factor_expired()),
      };
    case 429:
      return { status: "throttled", message: m.auth_two_factor_throttled() };
    default:
      return { status: "failed" };
  }
}
