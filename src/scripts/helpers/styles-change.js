/**
 *
 * @param {Object} obj một object chứa key value là những trường dữ
 *  liệu trùng tên với name trong DOM
 * @param {String} style thuộc tính cần thay đổi trong css
 * @param {String} styleChange kiểu thay đổi của css
 */
const changeStyleElementByObject = (obj, style, styleChange) => {
  for (const [key, value] of Object.entries(obj)) {
    const element = document.querySelector(`[name=${key}]`);
    console.log(element);
    element.style[style] = styleChange;
  }
  
};

export { changeStyleElementByObject };
