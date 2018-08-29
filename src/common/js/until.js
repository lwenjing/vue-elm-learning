/**
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id: 12345, a: b}
 */
export function urlParse() {
  let url = window.location.search.replace('?', '');
  let arr = url.split('&');
  let obj = {};
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.split('=');
      let key = tempArr[0];
      let val = tempArr[1];
      obj[key] = val;
    });
  }
  return obj;
}
