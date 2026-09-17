/** The smallest file a server sniffing content types still reads as a PDF. */
export function pdfFile(name: string) {
  const content = [
    "%PDF-1.4",
    "1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj",
    "2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj",
    "3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 200]>>endobj",
    "trailer<</Root 1 0 R>>",
    "%%EOF",
  ].join("\n");

  return { name, mimeType: "application/pdf", buffer: Buffer.from(content) };
}
