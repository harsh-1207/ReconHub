function text(value) {
  return value == null
    ? ""
    : String(value)
        .trim()
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, "")
        .replace(/\s+/g, " ");
}

function num(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function close(actual, filed, tolerance = 0.01) {
  const left = num(actual);
  const right = num(filed);
  if (left === null && right === null) return true;
  if (left === null || right === null) return false;
  return Math.abs(left - right) <= tolerance;
}

module.exports = { text, num, close };
