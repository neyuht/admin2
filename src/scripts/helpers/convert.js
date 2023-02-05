const convertArrayToString = (array) => {
  // "{\"4665cfg\": \"8797\"}"
  const newData = array.map((item) => {
    return `\"${item.key}\": \"${item.value}\"`;
  });
  return `{${newData.join(",")}}`;
};

export const convertDate = (dateT) => {
  const date = new Date(dateT);
  const day = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
  const month =
    date.getMonth() + 1 >= 10
      ? date.getMonth() + 1
      : "0" + (date.getMonth() + 1);
  const year = date.getFullYear();
  const convert = `${year}-${month}-${day}`;
  return convert;
};

export default convertArrayToString;
