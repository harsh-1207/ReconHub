const { text } = require("../matching/normalizeMatchValue");
function compare(a, b, field) {
  if (a == null && b == null) return true;
  if (a == null || b == null) return false;
  if (
    ["subtotal", "tax", "total", "quantity", "unitPrice", "amount"].includes(
      field,
    )
  ) {
    const x = Number(a),
      y = Number(b);
    return Number.isFinite(x) && Number.isFinite(y) && Math.abs(x - y) <= 0.01;
  }
  if (field === "date")
    return String(a).slice(0, 10) === String(b).slice(0, 10);
  return text(a) === text(b);
}
module.exports = { compare };
