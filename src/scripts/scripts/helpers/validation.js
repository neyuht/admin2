import { Value } from "sass";
import { changeStyleElementByObject } from "./styles-change";

/**
 * Kiểm tra xem dữ liệu có để trống hay không
 * @param {Object} obj
 * @returns {Object}
 */
const validate = (obj) => {
  const empty = {};
  for (const [key, value] of Object.entries(obj)) {
    if (!Boolean(value)) {
      empty[key] = "Can't be left blank";
    }
  }
  return empty;
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
  return notANumber;
};



/**
 * Kiểm tra form add và update promotion
 * @param {Object} obj  { code, percent, status, expire, ...other }
 * @returns {Boolean}
 */
const validateDataForm = (obj) => {
  changeStyleElementByObject(obj, "boxShadow", "0 0 0 0.3mm");
  const empty = validate(obj);
  const { code,codeUpdate, percent, status, startDate, endDate,statusUpdate,expireUpdate,startDateUpdate, ...other } = obj;
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

export { validate, validateNumber, validateDataForm };
