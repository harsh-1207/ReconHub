const BaseParser = require("./BaseParser");

class JsonParser extends BaseParser {
  supports(fileType) {
    return fileType === "json";
  }

  parse(buffer) {
    const data = JSON.parse(buffer.toString("utf8"));
    if (Array.isArray(data)) return data;

    if (data && Array.isArray(data.items)) {
      const { items, ...header } = data;
      if (!items.length) return [header];
      return items.map((item) => ({ ...header, ...item }));
    }

    return [data];
  }
}

module.exports = JsonParser;
