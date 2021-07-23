const convertToJSType = (type) => {
  switch (type.slice(0, type.indexOf("("))) {
    case "varchar":
      return "string";
    case "decimal":
      return "number";
    default:
      return "NaN";
  }
};
exports.convertToJSType = convertToJSType;
