import type { ExpenseData } from "@opusline/api-client";
import { Button } from "@opusline/ui/components/button";
import { Dropzone } from "@opusline/ui/components/dropzone";
import { FileTextIcon, PaperclipIcon } from "lucide-react";

import { expenseReceiptHref } from "@/lib/expenses";
import { m } from "@/paraglide/messages.js";

import { RECEIPT_ACCEPT } from "../lib/receipts";

type ExpenseReceiptCellProps = {
  expense: ExpenseData;
  isUploading: boolean;
  onAttach: (files: FileList) => void;
};

export function ExpenseReceiptCell({
  expense,
  isUploading,
  onAttach,
}: ExpenseReceiptCellProps) {
  if (expense.receipt !== null) {
    return (
      <Button
        aria-label={m.expenses_receipt_open_aria({
          name: expense.receipt.fileName,
        })}
        className="max-w-full justify-start"
        render={
          <a download href={expenseReceiptHref(expense.id)} rel="noreferrer" />
        }
        size="lg"
        title={expense.receipt.fileName}
        variant="file"
      >
        <FileTextIcon aria-hidden />
        <span className="truncate">{expense.receipt.fileName}</span>
      </Button>
    );
  }

  return (
    <Dropzone
      accept={RECEIPT_ACCEPT}
      aria-label={m.expenses_receipt_link_aria({ supplier: expense.supplier })}
      disabled={isUploading}
      onFiles={onAttach}
      size="inline"
      tone="attention"
    >
      <PaperclipIcon aria-hidden />
      {isUploading ? m.expenses_receipt_uploading() : m.expenses_receipt_link()}
    </Dropzone>
  );
}
