import request from "@/utils/request";

export function queryPage(params) {
  return request({
    url: "/exceptionWarnings",
    method: "get",
    params,
  });
}

export function queryWarnings(params) {
  return request({
    url: "/exceptionWarnings/",
    method: "get",
    params,
  });
}
