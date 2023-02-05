import { changeStyleElementByObject } from "./styles-change";

/**
 * Kiểm tra xem dữ liệu có để trống hay không
 * @param {Object} obj
 * @returns {Object}
 */
const validate = (obj) => {
  const empty = {};
  for (const [key, value] of Object.entries(obj)) {
    if (
      (typeof value === "object" && !Boolean(Object.values(value).length)) ||
      !Boolean(value)
    ) {
      empty[key] = "Can't be left blank";
    }
  }
  changeStyleElementByObject(empty, "boxShadow", "0 0 0 0.3mm red");
  const isError = Boolean(Object.keys(empty).length);
  return {
    field: empty,
    error: isError,
    message: isError ? "Nhap day du thong tin" : "",
  };
};

/**
 * Kiểm tra dữ liệu có phải là số hay không
 * @param {Object} obj
 * @returns {Object}
 */

const validateNumber = (obj) => {
  const notANumber = {};
  for (const [key, value] of Object.entries(obj)) {
    if (isNaN(value)) {
      notANumber[key] = "Not a number";
    }
  }
  changeStyleElementByObject(notANumber, "boxShadow", "0 0 0 0.3mm red");
  const isError = Boolean(Object.keys(notANumber).length);
  return {
    field: notANumber,
    error: isError,
    message: isError ? "Vui long nhap so" : "",
  };
};

/**
 * Kiểm tra xem số đó có > 0
 * @param {*} obj
 * @param {*} a
 */
const validateOperator = (obj, a) => {
  const notANumber = {};
  for (const [key, value] of Object.entries(obj)) {
    if (+value <= a) {
      notANumber[key] = "Not less than 0";
    }
  }
  changeStyleElementByObject(notANumber, "boxShadow", "0 0 0 0.3mm red");
  const isError = Boolean(Object.keys(notANumber).length);
  return {
    field: notANumber,
    error: Boolean(Object.keys(notANumber).length),
  };
};

const validateCode = (code) => {
  const error = isNaN(code[0]) && code[0].toUpperCase() === code[0];
  const obj = error
    ? {}
    : {
        code: "Must start with a letter and must be capitalized",
      };
  changeStyleElementByObject(obj, "boxShadow", "0 0 0 0.3mm red");
  return {
    field: obj,
    error: !error,
  };
};

const validateDate = (startDate, endDate) => {
  const error = {};
  const date = new Date();
  const currentDate = [date.getDate(), date.getMonth() + 1, date.getFullYear()];
  const startDates = startDate.split("-").map((item) => item * 1);
  const endDates = endDate.split("-").map((item) => item * 1);
  if (
    endDates[2] < currentDate[2] ||
    endDates[1] < currentDate[1] ||
    endDates[0] < currentDate[0]
  ) {
    error["endDate"] = "Check end date";
  }
  if (
    startDate[2] < currentDate[2] ||
    startDates[2] > endDates[2] ||
    startDates[1] < currentDate[1] ||
    startDates[1] > endDates[1] ||
    startDates[0] < currentDate[0] ||
    startDates[0] > endDates[0]
  ) {
    error["startDate"] = "Check start date";
  }
  changeStyleElementByObject(error, "boxShadow", "0 0 0 0.3mm red");
  const isError = Boolean(Object.keys(error).length);
  return {
    field: {
      ...error,
    },
    error: isError,
  };
};

/**
 * Kiểm tra form add và update promotion
 * @param {Object} obj  { code, percent, status, expire, ...other }
 * @returns {Boolean}
 */
const validateDataForm = (obj) => {
  changeStyleElementByObject(obj, "boxShadow", "0 0 0 0.3mm");
  const empty = validate(obj);
  const {
    code,
    codeUpdate,
    percent,
    status,
    startDate,
    endDate,
    statusUpdate,
    expireUpdate,
    startDateUpdate,
    ...other
  } = obj;
  const notANumber = validateNumber({
    ...other,
  });

  if (Object.keys(empty).length) {
    changeStyleElementByObject(empty, "boxShadow", "0 0 0 0.3mm red");
    return false;
  } else if (Object.keys(notANumber).length) {
    changeStyleElementByObject(notANumber, "boxShadow", "0 0 0 0.3mm red");
    return false;
  }
  return true;
};

export {
  validate,
  validateNumber,
  validateDataForm,
  validateOperator,
  validateCode,
  validateDate,
};
