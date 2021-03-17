import ar from "element-ui/src/locale/lang/ar";

export function pickAttrFromArrObj(arr, name) {
  const _arr = [];

  for (let i = 0; i < arr.length; i++) {
    _arr.push(arr[i][name]);
  }

  return _arr;
}
