import ar from "element-ui/src/locale/lang/ar";

export function pickAttrFromArrObj(arr, name) {
  const _arr = [];

  function _pick(objs, _level) {
    if (!objs || !objs.length) return;

    objs.forEach((obj) => {
      !obj.child.length && _arr.push(obj[name]);

      obj.child.length && _pick(obj.child);
    });
  }

  if (!Array.isArray(arr)) arr = [arr];

  _pick(arr, 0);

  return _arr;
}

export function changeObjectToChar(obj, _charFrom, _charTo) {
  // 为数组，循环判断
  if (Array.isArray(obj))
    obj.forEach((val, index) => {
      if (val && typeof val === "object")
        changeObjectToChar(val, _charFrom, _charTo);
      if (_charFrom.includes(val)) obj[index] = _charTo;
    });

  // 为对象，直接判断
  if (Object.prototype.toString.call(obj) === "[object Object]") {
    Object.entries(obj).forEach(([key, val]) => {
      if (val && typeof val === "object")
        changeObjectToChar(val, _charFrom, _charTo);
      if (_charFrom.includes(val)) obj[key] = _charTo;
    });
  }
}
