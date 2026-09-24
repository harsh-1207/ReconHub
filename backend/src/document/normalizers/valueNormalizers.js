function normalizeString(v) {
  if (v === null || v === undefined) return null;
  const s = String(v).trim().replace(/\s+/g, " ").toLowerCase();
  return s === "" ? null : s;
}
function normalizeNull(v) {
  return v === undefined || v === null || String(v).trim() === "" ? null : v;
}
module.exports = { normalizeString, normalizeNull };
