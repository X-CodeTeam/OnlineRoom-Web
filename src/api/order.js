import request from "@/utils/request";

export function queryPage(params) {
  return request({
    url: "/reserves",
    method: "get",
    params,
  });
}

export function queryObjects(params) {
  return request({
    url: "/reserves/objects",
    method: "get",
    params,
  });
}
