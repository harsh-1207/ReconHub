function normalizeNumber(v) {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "number") return Number(v);
  const s = String(v)
    .replace(/[,$₹€£\s]/g, "")
    .replace(/\(([^)]+)\)/, "-$1");
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}
module.exports = { normalizeNumber };
