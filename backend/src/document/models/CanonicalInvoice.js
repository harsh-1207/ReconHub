function createCanonicalInvoice() {
  return {
    invoiceNumber: null,
    vendor: null,
    date: null,
    currency: null,
    subtotal: null,
    tax: null,
    total: null,
    items: [],
  };
}
module.exports = { createCanonicalInvoice };
