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
    element.style[style] = styleChange;
    const parentElement = element.parentElement
    parentElement.setAttribute('data-error', value)
   parentElement.classList.add('err')
  }
  
};

const clearStyle = (obj) => {
  for (const [key, value] of Object.entries(obj)) {
    const element = document.querySelector(`[name=${key}]`);
    element.style['boxShadow'] = "0 0 0 0.3mm";
    const parentElement = element.parentElement
    parentElement.setAttribute('data-error', '')
   parentElement.classList.remove('err')
  }
}

export { changeStyleElementByObject,clearStyle };
