const { createCanonicalInvoice } = require("../models/CanonicalInvoice");
const { normalizeHeader } = require("./headerNormalizer");
const { normalizeItem } = require("./itemNormalizer");
const { extractItemRows } = require("./itemExtractor");
const { groupRawDocument } = require("./rawDocumentGrouper");

function mergeHeader(rows, invoice) {
  for (const row of rows) {
    const header = normalizeHeader(row);
    for (const field of Object.keys(header)) {
      if (invoice[field] == null && header[field] != null)
        invoice[field] = header[field];
    }
  }
}

function normalizeRows(parsedRows) {
  const rows = groupRawDocument(parsedRows);
  const invoice = createCanonicalInvoice();
  mergeHeader(rows, invoice);
  invoice.items = extractItemRows(rows).map((row, index) =>
    normalizeItem(row, index + 1),
  );
  return invoice;
}

module.exports = { normalizeRows };
