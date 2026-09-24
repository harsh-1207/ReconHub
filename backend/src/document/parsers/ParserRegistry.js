const CsvParser = require("./CsvParser");
const ExcelParser = require("./ExcelParser");
const JsonParser = require("./JsonParser");
class ParserRegistry {
  constructor() {
    this.parsers = [new CsvParser(), new ExcelParser(), new JsonParser()];
  }
  register(p) {
    this.parsers.push(p);
  }
  get(fileType) {
    const p = this.parsers.find((x) => x.supports(fileType));
    if (!p) throw new Error(`No parser registered for ${fileType}`);
    return p;
  }
}
module.exports = new ParserRegistry();
