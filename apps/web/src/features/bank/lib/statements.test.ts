import { describe, expect, it } from "vitest";

import { MAX_STATEMENT_BYTES, rejectStatementReason } from "./statements";

function fakeFile(name: string, size = 1024): File {
  const file = new File(["x"], name);
  Object.defineProperty(file, "size", { value: size });

  return file;
}

describe("rejectStatementReason", () => {
  it("accepts the bank export formats", () => {
    for (const name of [
      "releve.csv",
      "export.ofx",
      "export.qif",
      "camt053.xml",
      "releve.txt",
    ]) {
      expect(rejectStatementReason(fakeFile(name))).toBeNull();
    }
  });

  it("refuses a format no bank exports", () => {
    expect(rejectStatementReason(fakeFile("releve.pdf"))).toBe(
      "Format non pris en charge (CSV, OFX, QIF ou CAMT).",
    );
  });

  it("refuses an oversized file", () => {
    expect(
      rejectStatementReason(fakeFile("releve.csv", MAX_STATEMENT_BYTES + 1)),
    ).toBe("Ce fichier est trop lourd (max 10 Mo).");
  });
});
