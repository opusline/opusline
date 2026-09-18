import type {
  BankAccountData,
  BankConnectionAccountData,
  BankPsuType,
  BankSyncError,
} from "@opusline/api-client";

import { m } from "@/paraglide/messages.js";

/** What the Compte pro page can offer next about the bank sync. */
export type ConnectionState =
  | "unconfigured"
  | "disconnected"
  | "awaiting-account"
  | "active"
  | "expired";

export function connectionState(
  data: Pick<BankAccountData, "bankSyncConfigured" | "connection">,
): ConnectionState {
  if (data.connection === null) {
    return data.bankSyncConfigured ? "disconnected" : "unconfigured";
  }

  switch (data.connection.status) {
    case 0:
      return "active";
    case 1:
      return "awaiting-account";
    case 2:
      return "expired";
  }
}

/** Consents last up to 180 days; the last two weeks are when to say so. */
const EXPIRY_WARNING_DAYS = 14;

export function consentExpiresSoon(
  validUntil: string,
  now = Date.now(),
): boolean {
  return (
    new Date(validUntil).getTime() - now < EXPIRY_WARNING_DAYS * 86_400_000
  );
}

const BANK_SYNC_ERROR_MESSAGES: Record<BankSyncError, () => string> = {
  0: m.bank_sync_error_unavailable,
  1: m.bank_sync_error_rate_limited,
  2: m.bank_sync_error_consent_expired,
  3: m.bank_sync_error_credentials_rejected,
  4: m.bank_sync_error_currency_mismatch,
};

export function bankSyncErrorLabel(error: BankSyncError): string {
  return BANK_SYNC_ERROR_MESSAGES[error]();
}

const BANK_PSU_TYPE_MESSAGES: Record<BankPsuType, () => string> = {
  0: m.bank_connect_psu_business,
  1: m.bank_connect_psu_personal,
};

export function bankPsuTypeLabel(psuType: BankPsuType): string {
  return BANK_PSU_TYPE_MESSAGES[psuType]();
}

/** "Compte pro · ••0185": the name the bank gives it, then the IBAN's tail. */
export function bankAccountLabel(account: BankConnectionAccountData): string {
  const name = account.name ?? m.bank_connection_unnamed_account();

  return account.ibanLast4 === null ? name : `${name} · ••${account.ibanLast4}`;
}
