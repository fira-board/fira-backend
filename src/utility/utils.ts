import { Response } from "express";

const isNumericString = (str: string): boolean => {
  return !isNaN(parseFloat(str)) && isFinite(+str);
};
export const validateParameter = (
  parameter: any,
  label: string,
  validationTypes: string[],
  res: Response,
  validationArgs?: string[]
) => {
  let validationMsg = "";

  for (const [index, validationType] of validationTypes.entries()) {
    switch (validationType) {
      case "required":
        if (
          (parameter === undefined || parameter === null || parameter === "") &&
          parameter !== 0
        ) {
          validationMsg = " cannot be empty";
        }
        break;

      case "numeric":
        if (typeof parameter !== "number") {
          validationMsg = " must be numeric";
        }
        break;

      case "bigInt":
        if (
          parameter < -9223372036854775808n ||
          parameter > 9223372036854775807n
        ) {
          validationMsg = " out of range";
        }
        break;

      case "positive":
        if (parameter < 0) {
          validationMsg = " is negative";
        }
        break;

      case "inRange":
        {
          if (!validationArgs || !validationArgs[index]) {
            console.error("Missing validationArgs for inRange");
            return;
          }
          const numericRange = validationArgs.map(Number);
          if (
            typeof parameter !== "number" ||
            parameter < numericRange[0] ||
            parameter > numericRange[1]
          ) {
            validationMsg = ` must be between ${numericRange[0]} and ${numericRange[1]}`;
          }
        }
        break;

      case "inArray":
        {
          if (!validationArgs || !validationArgs[index]) {
            console.error("Missing validationArgs for inArray");
            return;
          }
          const arrElements = validationArgs[index].split(",");
          if (!arrElements.includes(String(parameter))) {
            validationMsg = " is not a valid value";
          }
        }
        break;

      case "isArray":
        if (!Array.isArray(parameter)) {
          validationMsg = " must be an array";
        }
        break;

      case "string":
        if (typeof parameter !== "string" || isNumericString(parameter)) {
          validationMsg = " must be a string";
        }
        break;

      default:
        return;
    }

    if (validationMsg) {
        res.status(400).send(`Value ${label}${validationMsg}`);
    }
  }
};
