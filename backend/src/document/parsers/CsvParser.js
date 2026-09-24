const { parse } = require("csv-parse/sync");
const BaseParser = require("./BaseParser");
class CsvParser extends BaseParser {
  supports(t) {
    return ["csv"].includes(t);
  }
  parse(buffer) {
    return parse(buffer.toString("utf8"), {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    });
  }
}
module.exports = CsvParser;
