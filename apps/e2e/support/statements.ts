type StatementRow = {
  bookedOn: string;
  label: string;
  amount: string;
};

/** A comma-separated export with ISO dates, the plainest layout the importer reads. */
export function bankStatementCsv(name: string, rows: StatementRow[]) {
  const lines = [
    "dateOp,label,amount",
    ...rows.map(
      ({ bookedOn, label, amount }) => `${bookedOn},${label},${amount}`,
    ),
  ];

  return {
    name,
    mimeType: "text/csv",
    buffer: Buffer.from(`${lines.join("\n")}\n`),
  };
}
