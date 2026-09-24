const {
  findCanonical,
} = require("../../src/document/normalizers/fieldNameNormalizer");
const a = require("../../src/document/normalizers/fieldAliases");
test("maps aliases", () => {
  expect(findCanonical("Grand Total", a)).toBe("total");
  expect(findCanonical("invoice_no", a)).toBe("invoiceNumber");
});
