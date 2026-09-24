function normalizeFieldName(v) {
  return String(v ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\-_]/g, " ")
    .replace(/\s+/g, " ");
}
function findCanonical(field, aliases) {
  const n = normalizeFieldName(field);
  for (const [key, vals] of Object.entries(aliases))
    if (vals.some((x) => normalizeFieldName(x) === n)) return key;
  return null;
}
module.exports = { normalizeFieldName, findCanonical };
