// The current supported formats parse into row-shaped records. This small adapter
// keeps grouping separate so future PDF/XML parsers can return sections without
// changing InvoiceNormalizer.
function groupRawDocument(parsedRows) {
  if (!Array.isArray(parsedRows)) return [];
  return parsedRows.filter((row) => row && typeof row === "object");
}

module.exports = { groupRawDocument };
