import {
  CA3_BOXES,
  type Ca3Box,
  HANDOFF_VERSION,
  type HandoffPayload,
} from "./payload";
import { PORTALS } from "./portals";

export const HANDOFF_FRAGMENT_KEY = "opusline";

const PERIOD_PATTERN = /^\d{4}-(0[1-9]|1[0-2]|Q[1-4])$/;

export function encodeHandoff(payload: HandoffPayload): string {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
}

/** The portal URL carrying the payload: `<landing page>#opusline=<token>`. */
export function handoffUrl(payload: HandoffPayload): string {
  return `${PORTALS[payload.portal].url}#${HANDOFF_FRAGMENT_KEY}=${encodeHandoff(payload)}`;
}

/**
 * Reads a payload back from `location.hash` (with or without the leading `#`).
 * Anything that is not exactly a current-version payload decodes to null: the
 * extension must never fill a form from a token it only half understands.
 */
export function decodeHandoff(hash: string): HandoffPayload | null {
  const token = new URLSearchParams(hash.replace(/^#/, "")).get(
    HANDOFF_FRAGMENT_KEY,
  );
  if (token === null) {
    return null;
  }

  const parsed = parseToken(token);

  return isHandoffPayload(parsed) ? parsed : null;
}

function parseToken(token: string): unknown {
  try {
    const binary = atob(token.replaceAll("-", "+").replaceAll("_", "/"));
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

function isHandoffPayload(value: unknown): value is HandoffPayload {
  if (!isRecord(value) || value.v !== HANDOFF_VERSION) {
    return false;
  }
  if (
    typeof value.period !== "string" ||
    !PERIOD_PATTERN.test(value.period) ||
    typeof value.issuedAt !== "string" ||
    Number.isNaN(Date.parse(value.issuedAt))
  ) {
    return false;
  }

  if (value.portal === "urssaf") {
    return (
      isRecord(value.fields) &&
      Object.keys(value.fields).length === 1 &&
      isWholeEuros(value.fields.turnover)
    );
  }
  if (value.portal === "impots") {
    return isCa3Fields(value.fields);
  }

  return false;
}

function isCa3Fields(fields: unknown): boolean {
  if (!isRecord(fields)) {
    return false;
  }
  const entries = Object.entries(fields);

  return (
    entries.length > 0 &&
    entries.every(
      ([box, amount]) =>
        CA3_BOXES.includes(box as Ca3Box) && isWholeEuros(amount),
    )
  );
}

function isWholeEuros(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) >= 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
