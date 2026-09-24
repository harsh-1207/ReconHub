class BaseParser {
  supports() {
    throw new Error(
      "BaseParser.supports() must be overridden by a concrete parser",
    );
  }

  parse() {
    throw new Error(
      "BaseParser.parse() must be overridden by a concrete parser",
    );
  }
}

module.exports = BaseParser;
