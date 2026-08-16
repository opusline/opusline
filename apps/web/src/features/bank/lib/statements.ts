import { fileRejector } from "@/lib/files";
import { m } from "@/paraglide/messages.js";

export const BANK_STATEMENT_ACCEPT = ".csv,.tsv,.txt,.ofx,.qif,.xml";

/** Mirrors the API's Max(10240) kilobytes on the import endpoint. */
export const MAX_STATEMENT_BYTES = 10_240 * 1024;

export const rejectStatementReason = fileRejector({
  accept: BANK_STATEMENT_ACCEPT,
  maxBytes: MAX_STATEMENT_BYTES,
  rejectType: m.bank_import_reject_type,
  rejectSize: m.bank_import_reject_size,
});
