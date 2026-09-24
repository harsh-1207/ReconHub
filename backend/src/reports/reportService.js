const repo = require("../database/repositories/reconciliationRepository");
const AppError = require("../utils/AppError");
const excel = require("./generators/excelReportGenerator");
const csv = require("./generators/csvReportGenerator");
async function generate(id, format) {
  const r = await repo.getDetails(id);
  if (!r) throw new AppError("Reconciliation not found", 404);
  if (format === "csv")
    return { buffer: csv.buffer(r), contentType: "text/csv", extension: "csv" };
  return {
    buffer: excel.buffer(r),
    contentType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    extension: "xlsx",
  };
}
module.exports = { generate };
