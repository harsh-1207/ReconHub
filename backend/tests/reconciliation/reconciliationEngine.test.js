const { reconcileDocuments } = require("../../src/reconciliation/engine");
const base = {
  invoiceNumber: "INV-1",
  vendor: "Acme Ltd",
  date: "2026-01-01",
  currency: "USD",
  subtotal: 100,
  tax: 10,
  total: 110,
  items: [
    { description: "Pen", quantity: 1, unitPrice: 100, tax: 10, amount: 110 },
  ],
};
test("identical docs match", () =>
  expect(
    reconcileDocuments(base, JSON.parse(JSON.stringify(base))).matchPercentage,
  ).toBe(100));
test("header mismatch creates exception", () => {
  const b = { ...base, total: 120 };
  const r = reconcileDocuments(base, b);
  expect(r.status).toBe("EXCEPTIONS_FOUND");
  expect(r.exceptions.some((x) => x.field_name === "total")).toBe(true);
});
