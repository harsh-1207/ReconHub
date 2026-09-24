const aliases = require("./fieldAliases");
const { findCanonical } = require("./fieldNameNormalizer");

const itemFields = new Set([
  "itemCode",
  "description",
  "quantity",
  "unitPrice",
  "itemTax",
  "tax",
  "amount",
]);

function isItemRow(row) {
  return Object.keys(row || {}).some((field) =>
    itemFields.has(findCanonical(field, aliases)),
  );
}

function extractItemRows(rows) {
  return (rows || []).filter(isItemRow);
}

module.exports = { isItemRow, extractItemRows };
