import { fileRejector } from "@/lib/files";
import { m } from "@/paraglide/messages.js";

export const RECEIPT_ACCEPT = ".pdf,.jpg,.jpeg,.png,.webp";

const RECEIPT_MAX_BYTES = 20 * 1024 * 1024;

/** Null when the file can be a receipt, otherwise the reason it cannot. */
export const receiptRejection = fileRejector({
  accept: RECEIPT_ACCEPT,
  maxBytes: RECEIPT_MAX_BYTES,
  rejectType: m.expenses_receipt_reject_type,
  rejectSize: m.expenses_receipt_reject_size,
});
