// /**
//  *
//  * @param { Object } object
//  * @param { Object } regex object = type -> regex, message -> message validate error
//  * @returns
//  */
// export const validation = (object, regex = null) => {
//   const field = {};
//   let error = false;

//   Object.entries(object).forEach(([key, value]) => {
//     if (!value) {
//       error = true;
//       field[key] = `${key} is required`;
//     } else if (regex && regex[key] && !regex[key].type.test(value)) {
//       error = true;
//       field[key] = regex[key].message;
//     }
//   });
//   return {
//     error,
//     field,
//   };
// };

// export const changeFormatDate = (date) => {
//   const dates = date.split('-');
//   return `${dates[2]}-${dates[1]}-${dates[0]}`;
// };

// /**
//  * Processing whether the first and last day checks are valid
//  * @param {Object} dateObj Contains keys as start and end
//  * @param {Object} isUpdate If you are in the update form, pass to true,
//   vice versa, there is no need to transmit
//  * @returns {Object}
//  */
// export const validateDate = (dateObj, isUpdate = false) => {
//   const { start = '', end = ''} = dateObj;
//   const date = new Date();
//   const currentMonth = date.getMonth() + 1;
//   const currentDay = date.getDate();
//   const currentYear = date.getFullYear();
//   const starts = start.split('-');
//   const ends = end.split('-');
//   if (isUpdate) {
//     return '';
//   }

//   if (starts[0] < currentYear || starts[0] > ends[0]) {
//     return {
//       error: true,
//       field : {
//         startDate: 'Year not valid',
//       }
//     };
//   }

//   if (starts[1] < currentMonth || starts[1] > ends[1]) {

//     return {
//       error: true,
//        field : {
//         startDate: 'Month not valid',
//        }
//     };
//   }

//   if ((starts[1] === ends[1]) && (starts[2] > ends[2] || starts[2] < currentDay))  {
//     return {
//       error: true,
//       field : {
//         startDate: 'Day not valid',
//       }
//     };
//   }

//   return {
//     error: false,
//     startDate: '',
//   };
// };

/**
 *
 * @param { Object } object
 * @param { Object } regex object = type -> regex, message -> message validate error
 * @returns
 */
export const validation = (object, regex = null) => {
  const field = {};
  let error = false;

  Object.entries(object).forEach(([key, value]) => {
    if (!value) {
      error = true;
      field[key] = `${key} is required`;
    } else if (regex && regex[key]) {
      const result = regex[key].find((item) => !item.type.test(value));
      if (result) {
        error = true;
        field[key] = result.message;
      }
    }
  });
  return {
    error,
    field,
  };
};

export const changeFormatDate = (date) => {
  const dates = date.split("-");
  return `${dates[2]}-${dates[1]}-${dates[0]}`;
};

/**
 * Processing whether the first and last day checks are valid
 * @param {Object} dateObj Contains keys as start and end
 * @param {Object} isUpdate If you are in the update form, pass to true,
  vice versa, there is no need to transmit
 * @returns {Object}
 */
// export const VaidateDate = (dateObj, isUpdate = false) => {
//   const { start, end } = dateObj;
//   const date = new Date();
//   const currentDay = date.getDay();
//   const currentMonth = date.getMonth() + 1;
//   const currentYear = date.getFullYear();
//   const starts = start.split('-');
//   const ends = end.split('-');
//   if (isUpdate) {
//     return '';
//   }

//   if (starts[2] < currentYear || starts[2] > ends[2]) {
//     return {
//       error: true,
//       message: 'Year not valid',
//     };
//   }

//   if (starts[1] < currentMonth || starts[1] > ends[1]) {
//     return {
//       error: true,
//       message: 'Month not valid',
//     };
//   }

//   if (starts[0] < currentDay || starts[0] > ends[0]) {
//     return {
//       error: true,
//       message: 'Day not valid',
//     };
//   }

//   return {
//     error: false,
//     message: '',
//   };
// };

export const validationDate = (date1) => {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const { field: date1F, value: dat1V } = date1;
  const [year, month, day] = dat1V.split("-");

  if (year < currentYear) {
    return {
      error: true,
      [date1F]: "Year not valid",
    };
  }
  if (month < currentMonth) {
    return {
      error: true,
      [date1F]: "Month not valid",
    };
  }
  if (day < currentDay) {
    return {
      error: true,
      [date1F]: "Day not valid",
    };
  }
  return {
    error: false,
    [date1F]: "",
  };
};

export const checkDate = (start, end) => {
  const [startY, startM, startD] = start.value.split("-");
  const [endY, endM, endD] = end.value.split("-");
  if (endY < startY) {
    return {
      error: true,
      [end.field]: "Day not valid",
    };
  }

  if (endM < startM) {
    return {
      error: true,
      [end.field]: "Day not valid",
    };
  }

  if (endD < startD) {
    return {
      error: true,
      [end.field]: "Ex Day not valid",
    };
  }

  return {
    error: false,
    [end.field]: "",
  };
};
