const { text, close } = require("./normalizeMatchValue");
const strategies = require("./matchingStrategies");

const strongStrategies = [
  strategies.byItemCode,
  strategies.byDescriptionQuantityPrice,
  strategies.byDescriptionPrice,
];

function isModified(actual, filed) {
  if (text(actual.description) !== text(filed.description)) return true;
  return ["quantity", "unitPrice", "tax", "amount"].some(
    (field) => !close(actual[field], filed[field]),
  );
}

function chooseStrongCandidate(actual, filedItems, usedFiledIndexes) {
  for (const strategy of strongStrategies) {
    const matches = filedItems
      .map((filed, filedIndex) => ({
        filed,
        filedIndex,
        score: strategy(actual, filed),
      }))
      .filter(
        (candidate) =>
          candidate.score > 0 && !usedFiledIndexes.has(candidate.filedIndex),
      );
    if (matches.length)
      return matches.sort((a, b) => a.filedIndex - b.filedIndex)[0];
  }
  return null;
}

function chooseUniqueDescriptionCandidate(
  actual,
  filedItems,
  usedFiledIndexes,
) {
  if (!actual.description) return null;
  const matches = filedItems
    .map((filed, filedIndex) => ({ filed, filedIndex }))
    .filter(
      ({ filed, filedIndex }) =>
        !usedFiledIndexes.has(filedIndex) &&
        filed.description &&
        text(filed.description) === text(actual.description),
    );
  return matches.length === 1 ? matches[0] : null;
}

function matchLineItems(actualItems = [], filedItems = []) {
  const usedFiledIndexes = new Set();
  const matches = [];

  actualItems.forEach((actual, actualIndex) => {
    const candidate =
      chooseStrongCandidate(actual, filedItems, usedFiledIndexes) ||
      chooseUniqueDescriptionCandidate(actual, filedItems, usedFiledIndexes);

    if (!candidate) {
      matches.push({
        status: "MISSING",
        actual,
        filed: null,
        actualIndex,
        filedIndex: null,
      });
      return;
    }

    usedFiledIndexes.add(candidate.filedIndex);
    matches.push({
      status: isModified(actual, candidate.filed) ? "MODIFIED" : "MATCHED",
      actual,
      filed: candidate.filed,
      actualIndex,
      filedIndex: candidate.filedIndex,
    });
  });

  filedItems.forEach((filed, filedIndex) => {
    if (!usedFiledIndexes.has(filedIndex)) {
      matches.push({
        status: "EXTRA",
        actual: null,
        filed,
        actualIndex: null,
        filedIndex,
      });
    }
  });

  return matches;
}

module.exports = { matchLineItems };
