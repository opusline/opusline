import { expect, it } from "vitest";

import { receiptRejection } from "./receipts";

function file(name: string, bytes = 100): File {
  return new File([new Uint8Array(bytes)], name);
}

it("accepts a PDF or a photo", () => {
  expect(receiptRejection(file("facture.pdf"))).toBeNull();
  expect(receiptRejection(file("ticket.JPG"))).toBeNull();
  expect(receiptRejection(file("ticket.webp"))).toBeNull();
});

it("refuses any other kind of file", () => {
  expect(receiptRejection(file("releve.csv"))).toBe(
    "Une facture est un PDF ou une photo (JPG, PNG, WebP).",
  );
});

it("refuses a file above twenty megabytes", () => {
  expect(receiptRejection(file("scan.pdf", 20 * 1024 * 1024 + 1))).toBe(
    "Ce fichier est trop lourd (20 Mo maximum).",
  );
});
