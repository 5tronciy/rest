const convertToJSType = (type) => {
  switch (type.indexOf("(") != -1 ? type.slice(0, type.indexOf("(")) : type) {
    case "varchar":
    case "char":
      return "string";
    case "decimal":
    case "int":
    case "tinyint":
      return "number";
    case "date":
      return "object";
    default:
      return "NaN";
  }
};
exports.convertToJSType = convertToJSType;
