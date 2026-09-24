const { text, close } = require("./normalizeMatchValue");

function byItemCode(actual, filed) {
  if (!actual.itemCode || !filed.itemCode) return 0;
  return text(actual.itemCode) === text(filed.itemCode) ? 100 : 0;
}

function byDescriptionQuantityPrice(actual, filed) {
  if (!actual.description || !filed.description) return 0;
  return text(actual.description) === text(filed.description) &&
    close(actual.quantity, filed.quantity) &&
    close(actual.unitPrice, filed.unitPrice)
    ? 90
    : 0;
}

function byDescriptionPrice(actual, filed) {
  if (!actual.description || !filed.description) return 0;
  return text(actual.description) === text(filed.description) &&
    close(actual.unitPrice, filed.unitPrice)
    ? 80
    : 0;
}

function byDescription(actual, filed) {
  if (!actual.description || !filed.description) return 0;
  return text(actual.description) === text(filed.description) ? 50 : 0;
}

module.exports = {
  byItemCode,
  byDescriptionQuantityPrice,
  byDescriptionPrice,
  byDescription,
};
