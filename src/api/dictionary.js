import request from "@/utils/request";
import config from "../config";

export function dictionariesByTypeCode(dictType) {
  return request.get("/dicts", {
    params: {
      dictType,
      enableMark: true,
      size: 999, // 请求分页
    },
  });
}

export default {
  dictionariesByTypeCode,
};
