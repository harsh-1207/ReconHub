const { compare } = require("../rules/comparisonRules");
const { matchLineItems } = require("../matching");
const { buildExceptions } = require("../services/exceptionService");

const headerFields = [
  "invoiceNumber",
  "vendor",
  "date",
  "currency",
  "subtotal",
  "tax",
  "total",
];
const lineFields = ["description", "quantity", "unitPrice", "tax", "amount"];

function display(value) {
  return value == null ? "" : String(value);
}

function comparisonResult(
  category,
  field,
  actual,
  filed,
  itemDescription = null,
) {
  const same = compare(actual, filed, field);
  return {
    category,
    field_name: field,
    item_description: itemDescription,
    item_status: null,
    actual_value: display(actual),
    filed_value: display(filed),
    difference: same ? "" : `${display(actual)} vs ${display(filed)}`,
    comparison_status: same ? "MATCHED" : "DIFFERENT",
  };
}

function reconcileDocuments(actual, filed) {
  const results = headerFields.map((field) =>
    comparisonResult("HEADER", field, actual[field], filed[field]),
  );
  const lineMatches = matchLineItems(actual.items || [], filed.items || []);

  lineMatches.forEach((match, index) => {
    if (match.status === "MISSING" || match.status === "EXTRA") {
      const actualItem = match.actual || {};
      const filedItem = match.filed || {};
      results.push({
        category: "LINE_ITEM",
        field_name: match.status,
        item_description:
          actualItem.description ||
          filedItem.description ||
          `Item ${index + 1}`,
        item_status: match.status,
        actual_value: match.actual ? JSON.stringify(match.actual) : "",
        filed_value: match.filed ? JSON.stringify(match.filed) : "",
        difference: match.status,
        comparison_status: "DIFFERENT",
      });
      return;
    }

    lineFields.forEach((field) => {
      const result = comparisonResult(
        "LINE_ITEM",
        field,
        match.actual[field],
        match.filed[field],
        match.actual.description ||
          match.filed.description ||
          `Item ${index + 1}`,
      );
      result.item_status = match.status;
      results.push(result);
    });
  });

  const totalComparisons = results.length;
  const matchedFields = results.filter(
    (result) => result.comparison_status === "MATCHED",
  ).length;
  const differentFields = totalComparisons - matchedFields;
  const matchPercentage = totalComparisons
    ? Number(((matchedFields / totalComparisons) * 100).toFixed(2))
    : 100;
  const exceptions = buildExceptions(results);

  return {
    status: exceptions.length ? "EXCEPTIONS_FOUND" : "MATCHED",
    matchPercentage,
    totalComparisons,
    matchedFields,
    differentFields,
    results,
    exceptions,
  };
}

module.exports = { reconcileDocuments };
