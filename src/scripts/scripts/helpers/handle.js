/**
 * Chuyển đổi từ date sàng timstamps
 * @param {String} date
 * @return {Date}
 */
const convertTime = (date) => {
  var myDate = "26-02-2012";
  myDate = myDate.split("-");
  var newDate = new Date(myDate[2], myDate[1] - 1, myDate[0]);
  return newDate.getTime();
};

export { convertTime };
