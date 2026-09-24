const XLSX = require("xlsx");

function appendSheet(workbook, name, rows) {
  const safeRows = rows.length ? rows : [{ message: "No records" }];
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(safeRows),
    name,
  );
}

function buffer(report) {
  const workbook = XLSX.utils.book_new();
  const summary = [
    ["Invoice Reconciliation Report"],
    ["Actual Document", report.actual_document_name],
    ["Filed Document", report.filed_document_name],
    ["Status", report.status],
    ["Match Percentage", report.match_percentage],
    ["Total Comparisons", report.total_comparisons],
    ["Matched Fields", report.matched_fields],
    ["Different Fields", report.different_fields],
    ["Generated At", new Date().toISOString()],
  ];
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet(summary),
    "Summary",
  );

  appendSheet(
    workbook,
    "Exceptions",
    report.exceptions.map((item) => ({
      Category: item.category,
      Field: item.field_name,
      Item: item.item_description,
      "Item Status": item.item_status,
      Actual: item.actual_value,
      Filed: item.filed_value,
      Difference: item.difference,
      Severity: item.severity,
      Status: item.status,
    })),
  );

  appendSheet(
    workbook,
    "Comparisons",
    report.results.map((item) => ({
      Category: item.category,
      Field: item.field_name,
      Item: item.item_description,
      "Item Status": item.item_status,
      Actual: item.actual_value,
      Filed: item.filed_value,
      Difference: item.difference,
      Result: item.comparison_status,
    })),
  );

  appendSheet(
    workbook,
    "Line Items",
    report.results
      .filter((item) => item.category === "LINE_ITEM")
      .map((item) => ({
        Field: item.field_name,
        Item: item.item_description,
        "Item Status": item.item_status,
        Actual: item.actual_value,
        Filed: item.filed_value,
        Difference: item.difference,
        Result: item.comparison_status,
      })),
  );

  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
}

module.exports = { buffer };
