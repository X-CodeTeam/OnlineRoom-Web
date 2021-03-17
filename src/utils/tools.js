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
