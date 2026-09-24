const XLSX = require("xlsx");
const ExcelParser = require("../../src/document/parsers/ExcelParser");
test("parses xlsx", () => {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([
      ["Invoice Number", "Total"],
      ["INV-1", 100],
    ]),
    "Sheet1",
  );
  const b = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  expect(new ExcelParser().parse(b)[0]["Invoice Number"]).toBe("INV-1");
});
